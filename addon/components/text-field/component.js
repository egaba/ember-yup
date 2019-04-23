import FormField from 'ember-yup/components/form-field/component';
import { computed, observer } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component is used for validating text values.
 */
export default FormField.extend({
  layout,

  defaultValidationMessages: Ember.computed(function() {
    return {
      dataType: undefined,
      email: undefined,
      url: undefined,
      type: undefined,
      required: undefined,
      charLimit: 'character limit has been exceeded',
      matches: undefined,
      nullable: undefined,
    };
  }).readOnly(),

  // options
  type: 'string',
  required: false,
  nullable: false,

  dataSchema: computed(
    'validationMessages.dataType',
    'type', 'validationMessages.email', 'validationMessages.url', 'validationMessages.type',
    'matches', 'validationMessages.matches',
    'required', 'validationMessages.required',
  function() {
    const type = this.get('type');

    let dataSchema = yup.string(this.get('validationMessages.dataType'));
    if (type === 'email') {
      dataSchema = dataSchema.email(this.get('validationMessages.email') || this.get('validationMessages.type'));
    } else if (type === 'url') {
      dataSchema = dataSchema.url(this.get('validationMessages.url') || this.get('validationMessages.type'));
    }

    if (this.get('matches')) {
      const matchesRegex = new RegExp(this.get('matches'));
      dataSchema = dataSchema.matches(matchesRegex, this.get('validationMessages.matches'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    if (this.get('nullable')) {
      dataSchema = dataSchema.nullable(this.get('validationMessages.nullable'));
    }

    return dataSchema;
  }),

  charLimit: 0,
  charLimitSchema: computed('charLimit', 'validationMessages.charLimit', function() {
    const charLimit = this.get('charLimit');
    console.log('char limit schema message:', this.get('validationMessages.charLimit'));
    return yup.number().max(charLimit, this.get('validationMessages.charLimit'));
  }),
  charRemaining: computed('value', 'charLimit', function() {
    const charLimit = this.get('charLimit');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return charLimit - charCount;
    }

    return 0;
  }),

  validation: computed('value', 'enabled', 'dataSchema', 'charLimit', 'charLimitSchema', 'abortEarly', function() {
    if (!this.get('enabled')) {
      return RSVP.resolve(); // TODO: should we reject?
    }

    const abortEarly = this.get('abortEarly');
    const value = this.get('value');
    const validation = {
      data: this.get('dataSchema').validate(value, { abortEarly: abortEarly })
    };

    if (this.get('charLimit') > 0) {
      validation.charLimit = this.get('charLimitSchema').validate(value.length);
    }

    const name = this.get('name');

    return new RSVP.Promise(function(resolve, reject) {
      if (abortEarly) {
        RSVP.hash(validation).then(function(hash) {
          resolve(hash.data);
        }).catch((e) => reject([e]));
      } else {
        RSVP.hashSettled(validation).then(function(hash) {
          let errors = [], returnValue = value, errorMessages = [];

          for (const validationType in hash) {
            const state = hash[validationType].state;
            if (hash[validationType].state === 'rejected') {
              const error = hash[validationType].reason;
              error.type = validationType;
              errors = errors.concat(error);
            } else if (validationType === 'data' && hash[validationType].state === 'fulfilled') {
              returnValue = hash[validationType].value;
            }
          }

          if (errors.length) {
            reject(errors);
          } else {
            resolve(returnValue);
          }
        });
      }
    });
  }),
});
