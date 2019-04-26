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

  validation: computed('formFields.@each.validation', 'enabled', 'dataSchema', 'abortEarly', function() {
    if (!this.get('enabled')) {
      return RSVP.resolve();
    }

    debugger;
    const abortEarly = this.get('abortEarly');
    const value = this.get('value');
    const validation = {
      data: this.get('dataSchema').validate(value, { abortEarly: abortEarly })
    };

    return new RSVP.Promise(function(resolve, reject) {
      if (abortEarly) {
        RSVP.hash(validation).then(function(hash) {
          resolve(hash.data);
        }).catch((e) => {
          reject([e]);
        });
      } else {
        RSVP.hashSettled(validation).then(function(hash) {
          let errors = [], returnValue = value;

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

  readValidation: observer('enabled', 'formFields.@each.validation', function() {
    if (this.get('enabled')) {
      const value = this.get('value');

      this.get('validation')
        .then((val) => {
          if (this.onInput) {
            this.onInput(val);
          }

          this.get('errors').clear();
        })
        .catch((errors) => {
          if (this.onInput) {
            this.onInput(value);
          }
          this.get('errors').clear();
          this.get('errors').addObjects(errors);
        });
    } else {
      this.get('errors').clear();
    }
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
});
