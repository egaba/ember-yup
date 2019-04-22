import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component is used for validating numeric values.
 */
export default FormField.extend({
  layout,

  validationMessages: {
    dataType: undefined,
    required: undefined,
    integer: undefined,
    positive: undefined,
    negative: undefined,
    min: undefined,
    max: undefined,
    lt: undefined,
    gt: undefined,
  },

  // options
  required: false,
  integer: false,
  positive: false,
  negative: false,
  min: undefined,
  max: undefined,
  lt: undefined,
  gt: undefined,

  dataSchema: computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
    'integer', 'validationMessages.integer',
    'positive', 'validationMessages.positive',
    'negative', 'validationMessages.negative',
    'min', 'validationMessages.min',
    'max','validationMessages.max',
  function() {
    let dataSchema = yup.number(this.get('validationMessages.dataType'));

    if (this.get('integer')) {
      dataSchema = dataSchema.integer(this.get('validationMessages.integer'));
    }

    if (this.get('positive')) {
      dataSchema = dataSchema.positive(this.get('validationMessages.positive'));
    } else if (this.get('negative')) {
      dataSchema = dataSchema.negative(this.get('validationMessages.negative'));
    }

    if (this.get('min')) {
      dataSchema = dataSchema.min(this.get('min'), this.get('validationMessages.min'));
    }

    if (this.get('max')) {
      dataSchema = dataSchema.max(this.get('max'), this.get('validationMessages.max'));
    }

    if (this.get('lt')) {
      dataSchema = dataSchema.lessThan(this.get('lt'), this.get('validationMessages.lt'));
    }

    if (this.get('gt')) {
      dataSchema = dataSchema.moreThan(this.get('gt'), this.get('validationMessages.gt'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),

  validation: computed('value', 'dataSchema', 'abortEarly', function() {
    const value = this.get('value');
    const validation = {
      data: this.get('dataSchema').validate(value, { abortEarly: this.get('abortEarly') })
    };

    return new RSVP.Promise(function(resolve, reject) {
      RSVP.hash(validation).then(function(hash) {
        resolve(hash.data);
      }).catch(function(e) {
        reject(e.errors);
      });
    });
  }),

  // dataValidation: computed('value', 'dataSchema', function() {
  //   const dataSchema = this.get('dataSchema');
  //
  //   return dataSchema ? dataSchema.validate(this.get('value'), { abortEarly: false }) : null;
  // }),
  //
  // validation: computed('dataValidation', function() {
  //   const dataValidation = this.get('dataValidation');
  //   const validations = {};
  //
  //   if (dataValidation) {
  //     validations.data = dataValidation;
  //   }
  //
  //   if (Object.keys(validations).length) {
  //     const validate = RSVP.hashSettled(validations);
  //
  //     return new RSVP.Promise(function(resolve, reject) {
  //       validate.then(function(validations) {
  //         let errors = [];
  //
  //         if (validations.data && validations.data.state === 'rejected') {
  //           errors = errors.concat(validations.data.reason.errors);
  //         }
  //
  //         if (errors.length) {
  //           reject(errors);
  //         } else {
  //           resolve(validations.data.value)
  //         }
  //       });
  //     });
  //   }
  //
  //   return null;
  // }),
});
