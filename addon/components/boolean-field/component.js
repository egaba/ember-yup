import FormField from 'ember-yup/components/form-field/component';
import { computed } from '@ember/object';
import layout from './template';
import * as yup from 'yup';

/**
 * This component is used for validating boolean values.
 */
export default FormField.extend({
  layout,

  defaultValidationMessages: computed(function() {
    return {
      dataType: undefined,
      required: '${path} is required',
    };
  }).readOnly(),

  // options
  required: false,

  dataSchema: computed('validationMessages.dataType', 'required', 'validationMessages.required', function() {
    let dataSchema = yup.bool(this.get('validationMessages.dataType'));

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required')).equals([true], this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),
});
