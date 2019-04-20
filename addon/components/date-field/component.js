import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component is used for validating date values.
 */
export default FormField.extend({
  layout,

  validationMessages: {
    dataType: undefined,
    required: undefined,
    min: undefined,
    max: undefined,
  },

  // options
  required: false,
  min: undefined,
  max: undefined,

  dataSchema: computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
    'min', 'validationMessages.min',
    'max','validationMessages.max',
  function() {
    let dataSchema = yup.date(this.get('validationMessages.dataType'));

    if (this.get('min')) {
      dataSchema = dataSchema.min(this.get('min'), this.get('validationMessages.min'));
    }

    if (this.get('max')) {
      dataSchema = dataSchema.max(this.get('max'), this.get('validationMessages.max'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),

  dataValidation: computed('value', 'dataSchema', function() {
    const dataSchema = this.get('dataSchema');
    return dataSchema ? dataSchema.validate(this.get('value'), { abortEarly: false }) : null;
  }),

  validation: computed('dataValidation', function() {
    const dataValidation = this.get('dataValidation');
    const validations = {};

    if (dataValidation) {
      validations.data = dataValidation;
    }

    if (Object.keys(validations).length) {
      const validate = RSVP.hashSettled(validations);

      return new RSVP.Promise(function(resolve, reject) {
        validate.then(function(validations) {
          let errors = [];

          if (validations.data && validations.data.state === 'rejected') {
            errors = errors.concat(validations.data.reason.errors);
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
  }),
});
