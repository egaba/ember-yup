import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
// import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component wraps `Yup.string()` and validates string values.
 *
 * @class TextField
 */
export default FormField.extend({
  /**
    * The value of the field.
    *
    * @property {String} value
    * @yielded
    */
  value: undefined,

  /**
    * Specify a regex to match the field. Since this is within a template, only
    * the String form of the regex is permitted. ex. "^\d{5}$"
    *
    * @property {String} matches
    */
  matches: undefined,

  /**
    * These are the default validation messages set by the Ember Yup library.
    * Leave the properties `undefined` to allow defaults to be set by Yup.
    *
    * @property {Object} defaultValidationMessages
    * @private
    */
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
  }),

  /**
    * The validation subtype.
    *
    * @property {Enum} type string|email|url
    * @defaultValue string
    */
  type: 'string',

  /**
    * The primary schema that determines the fields validity.
    *
    * @property {Object} dataSchema
    * @private
    */
  dataSchema: computed(
    'validationMessages.dataType',
    'type', 'validationMessages.email', 'validationMessages.url', 'validationMessages.type',
    'matches', 'validationMessages.matches',
    'required', 'validationMessages.required',
  function() {
    const type = this.get('type');

    let dataSchema = yup.string();

    if (this.get('validationMessages.dataType')) {
      dataSchema = dataSchema.typeError(this.get('validationMessages.dataType'));
    }

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

  /**
    * The maximum number of characters allowed for the `value`.
    *
    * @property {Number} charLimit
    * @defaultValue 0
    */
  charLimit: 0,

  /**
    * Determines validity by measuring the length of the `value`.
    *
    * @property {Object} charLimitSchema
    * @private
    */
  charLimitSchema: computed('charLimit', 'validationMessages.charLimit', function() {
    const charLimit = this.get('charLimit');
    return yup.number().max(charLimit, this.get('validationMessages.charLimit'));
  }),

  /**
    * A yielded property the contains the number of allowable characters for the
    * length of the `value`.
    *
    * @property {Number} charRemaining
    * @yielded
    */
  charRemaining: computed('value', 'charLimit', function() {
    const charLimit = this.get('charLimit');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return charLimit - charCount;
    }

    return 0;
  }),

  yieldedProperties: Ember.computed('charRemaining', 'errorMessages', 'value', 'hasErrors', 'didValidate', 'showErrorMessages', 'disabled', function() {
    return this.getProperties('charRemaining', 'errorMessages', 'value', 'hasErrors', 'didValidate', 'showErrorMessages', 'disabled');
  }),

  /**
    * The validation result of the latest computed `value`.
    *
    * @property {Promise} validation
    * @private
    */
  validation: computed('value', 'disabled', 'dataSchema', 'charLimit', 'charLimitSchema', 'abortEarly', function() {
    if (this.get('disabled')) {
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
