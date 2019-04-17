import FormField from 'ember-yup/components/form-field/component';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import layout from './template';
import * as yup from 'yup';

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
  },

  // options
  required: false,
  integer: false,
  positive: false,
  negative: false,
  min: undefined,
  max: undefined,

  schema: Ember.computed(
    'validationMessages.dataType',
    'required', 'validationMessages.required',
    'integer', 'validationMessages.integer',
    'positive', 'validationMessages.positive',
    'negative', 'validationMessages.negative',
    'min', 'validationMessages.min',
    'max','validationMessages.max',
  function() {
    let schema = yup.number(this.get('validationMessages.dataType'));

    if (this.get('integer')) {
      schema = schema.integer(this.get('validationMessages.integer'));
    }

    if (this.get('positive')) {
      schema = schema.positive(this.get('validationMessages.positive'));
    } else if (this.get('negative')) {
      schema = schema.negative(this.get('validationMessages.negative'));
    }

    if (this.get('min')) {
      schema = schema.min(this.get('min'), this.get('validationMessages.min'));
    }

    if (this.get('max')) {
      schema = schema.max(this.get('max'), this.get('validationMessages.max'));
    }

    if (this.get('required')) {
      schema = schema.required(this.get('validationMessages.required'));
    }

    return schema;
  }),
});
