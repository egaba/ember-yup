import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';

/**
 * This component is used for validating boolean values.
 * @class BooleanField
 * @extends FormField
 */
export default FormField.extend({
  layout,

  /**
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
