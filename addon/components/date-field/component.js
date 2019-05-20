import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import * as yup from 'yup';

/**
 * This component wraps `Yup.date()` and validates date values.
 *
 * @class DateField
 */
export default FormField.extend({
  /**
    * The value of the field.
    *
    * @property {Date} value
    */
  value: undefined,

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
      required: undefined,
      min: undefined,
      max: undefined,
    };
  }),

  /**
    * The minimum date allowed for the field's `value`.
    *
    * @property {Date} min
    */
  min: undefined,

  /**
    * The maximum date allowed for the field's `value`.
    *
    * @property {Date} max
    */
  max: undefined,

  /**
    * The primary schema that determines the fields validity.
    *
    * @property {Object} dataSchema
    * @private
    */
  dataSchema: computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
    'min', 'validationMessages.min',
    'max','validationMessages.max',
  function() {
    let dataSchema = yup.date();

    if (this.get('validationMessages.dataType')) {
      dataSchema = dataSchema.typeError(this.get('validationMessages.dataType'));
    }

    if (this.get('min')) {
      dataSchema = dataSchema.min(this.get('min'), this.get('validationMessages.min'));
    }

    if (this.get('max')) {
      dataSchema = dataSchema.max(this.get('max'), this.get('validationMessages.max'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),
});
