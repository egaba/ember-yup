import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';

/**
 * This component wraps `Yup.bool()` and validates boolean values.
 * @class BooleanField
 */
export default FormField.extend({
  layout,

   /**
     * @property {String|Boolean} value The value of the field.
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
      required: '${path} is required',
    };
  }).readOnly(),

  /**
    * The primary schema that determines the fields validity.
    * @property {Object} dataSchema
    * @private
    */
  dataSchema: computed('validationMessages.dataType', 'required', 'validationMessages.required', function() {
    let dataSchema = yup.bool();

    if (this.get('validationMessages.dataType')) {
      dataSchema = dataSchema.typeError(this.get('validationMessages.dataType'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required')).equals([true], this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),
});
