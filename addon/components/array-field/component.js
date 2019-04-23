import FormField from 'ember-yup/components/form-field/component';
import { computed, observer } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component is used for validating arrays.
 */
export default FormField.extend({
  layout,

  formFields: Ember.A(),

  validationMessages: {
    dataType: undefined,
    required: undefined,
  },

  readErrors: observer('enabled', 'validation', function() {
    this.get('validation')
      .then((val) => {
        this.set('errors', [])
      })
      .catch((errors) => {
        this.set('errors', errors)
      });
  }),

  // options
  required: false,

  dataSchema: computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
  function() {
    let dataSchema = yup.array(this.get('validationMessages.dataType'));

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),

  validation: computed('formFields.@each.value', 'enabled', 'dataSchema', 'abortEarly', function() {
    if (!this.get('enabled')) {
      return RSVP.resolve();
    }

    return new RSVP.Promise((resolve, reject) => {
      const validations = [];

      this.get('formFields').forEach(function(field) {
        field.send('enableValidation');
        validations.push(field.get('validation'));
      });

      // !abortEarly
      RSVP.allSettled(validations).then(function(validations) {
        let errors = [];

        validations.forEach(function(validation) {
          if (validation.state === 'rejected') {
            errors = errors.concat(validation.reason);
          }
        });

        if (errors.length) {
          reject(errors);
        } else {
          resolve(Ember.A(validations).mapBy('value'));
        }
      });
    });
  }),
});
