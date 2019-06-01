import FormField from '../form-field/component';
// import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import * as yup from 'yup';

/**
 * This component wraps `Yup.number()` and validates numeric values.
 * @class NumberField
 */
export default FormField.extend({
  /**
    * The value of the field.
    *
    * @property {Number} value
    */
  value: undefined,

  /**
    * Permits Yup to transform the field's value before passing the value through.
    *
    * @property {Boolean} allowTransform
    * @private
    * @defaultValue true
    */
  allowTransform: true,

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
      integer: undefined,
      positive: undefined,
      negative: undefined,
      min: undefined,
      max: undefined,
      lt: undefined,
      gt: undefined,
    };
  }),

  /**
    * Validates that field value is an integer.
    * @property {Boolean} integer
    */
  integer: false,

  /**
    * Validates that field value is positive.
    * @property {Boolean} positive
    */
  positive: false,

  /**
    * Validates that field value is negative.
    * @property {Boolean} negative
    */
  negative: false,

  /**
    * Set the minimum allowed value for the field.
    * @property {Number} min
    */
  min: undefined,

  /**
    * Set the maximum allowed value for the field.
    * @property {Number} max
    */
  max: undefined,

  /**
    * Set a value that the field value should be less than.
    * @property {Number} lt
    */
  lt: undefined,

  /**
    * Set a value that the field value should be greater than.
    * @property {Number} gt
    */
  gt: undefined,

  /**
    * The primary schema that determines the fields validity.
    *
    * @property {Object} dataSchema
    * @private
    */
  dataSchema: computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
    'integer', 'validationMessages.integer',
    'positive', 'validationMessages.positive',
    'negative', 'validationMessages.negative',
    'min', 'validationMessages.min',
    'max','validationMessages.max',
  function() {
    let dataSchema = yup.number();

    if (this.get('validationMessages.dataType')) {
      dataSchema = dataSchema.typeError(this.get('validationMessages.dataType'));
    }

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
});
