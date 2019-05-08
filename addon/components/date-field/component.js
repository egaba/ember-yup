import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';

/**
 * This component is used for validating date values.
 * @class DateField
 * @extends FormField
 */
export default FormField.extend({
  layout,

  /**
    * The value of the field.
    * @property {String|Date} value
    * @yielded
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
  }).readOnly(),

  /**
    * @property {Date} min
    * @validationOption
    */
  min: undefined,

  /**
    * @property {Date} max
    * @validationOption
    */
  max: undefined,

  /**
    * The primary schema that determines the fields validity.
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
