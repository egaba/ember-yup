import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component is used for validating text values.
 */
export default FormField.extend({
  layout,

  defaultValidationMessages: computed(function() {
    return {
      dataType: undefined,
      email: undefined,
      url: undefined,
      type: undefined,
      required: undefined,
      charLimit: 'character limit has been exceeded',
      matches: undefined,
    };
  }).readOnly(),

  // options
  type: 'string',
  required: false,

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

    return dataSchema;
  }),

  charLimit: 0,
  charLimitSchema: computed('charLimit', 'validationMessages.charLimit', function() {
    const charLimit = this.get('charLimit');
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
      const numChars = value ? value.length : 0;
      validation.charLimit = this.get('charLimitSchema').validate(numChars);
    }

    return new RSVP.Promise(function(resolve, reject) {
      if (abortEarly) {
        RSVP.hash(validation).then(function(hash) {
          resolve(hash.data);
        }).catch((e) => reject([e]));
      } else {
        RSVP.hashSettled(validation).then(function(hash) {
          let errors = [], returnValue = value;

          for (const validationType in hash) {
            const state = hash[validationType].state;
            if (state === 'rejected') {
              const error = hash[validationType].reason;
              error.type = validationType;
              errors = errors.concat(error);
            } else if (validationType === 'data' && state === 'fulfilled') {
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
