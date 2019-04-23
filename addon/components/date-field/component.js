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

  defaultValidationMessages: Ember.computed(function() {
    return {
      dataType: undefined,
      required: undefined,
      min: undefined,
      max: undefined,
      nullable: undefined,
    };
  }).readOnly(),

  // options
  required: false,
  min: undefined,
  max: undefined,
  nullable: false,

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
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),
});
