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

  validationMessages: {
    dataType: undefined,
    email: undefined,
    url: undefined,
    type: undefined,
    required: undefined,
    charLimit: 'this exceeds the character limit',
    matches: undefined,
  },

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

    return charLimit > 0 ? yup.number().max(charLimit, this.get('validationMessages.charLimit')) : null;
  }),
  charRemaining: computed('value', 'charLimit', function() {
    const charLimit = this.get('charLimit');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return charLimit - charCount;
    }

    return 0;
  }),

  charLimitValidation: computed('value', 'charLimitSchema', function() {
    const charLimitSchema = this.get('charLimitSchema');

    return charLimitSchema ? charLimitSchema.validate(this.get('value.length'), { abortEarly: false }) : null;
  }),

  dataValidation: computed('value', 'dataSchema', function() {
    const dataSchema = this.get('dataSchema');

    return dataSchema ? dataSchema.validate(this.get('value'), { abortEarly: false }) : null;
  }),

  validation: computed('charLimitValidation', 'dataValidation', function() {
    const dataValidation = this.get('dataValidation');
    const charLimitValidation = this.get('charLimitValidation');
    const validations = {};

    if (dataValidation) {
      validations.data = dataValidation;
    }

    if (charLimitValidation) {
      validations.charLimit = charLimitValidation;
    }

    if (Object.keys(validations).length) {
      const validate = RSVP.hashSettled(validations);

      return new RSVP.Promise(function(resolve, reject) {
        validate.then(function(validations) {
          let errors = [];

          if (validations.data && validations.data.state === 'rejected') {
            errors = errors.concat(validations.data.reason.errors);
          }

          if (validations.charLimit && validations.charLimit.state === 'rejected') {
            errors = errors.concat(validations.charLimit.reason.errors);
          }

          if (errors.length) {
            reject(errors);
          } else {
            resolve(validations.data.value)
          }
        });
      });
    }

    return null;
  })
});
