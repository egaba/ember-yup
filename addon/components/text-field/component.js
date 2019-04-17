import FormField from 'ember-yup/components/form-field/component';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import layout from './template';
import * as yup from 'yup';

/**
 * This component is used for validating text values.
 */
const TextField = FormField.extend({
  layout,

  validationMessages: {
    dataType: undefined,
    email: undefined,
    url: undefined,
    required: undefined,
    charLimit: 'this field exceeds the character limit',
  },

  errors: Ember.computed('schemaErrors.[]', 'charLimitErrors.[]', function() {
    return this.get('schemaErrors').concat(this.get('charLimitErrors'));
  }),

  // options
  type: 'string',
  required: false,

  schema: Ember.computed(
    'validationMessages.dataType',
    'type', 'validationMessages.email', 'validationMessages.url',
    'required', 'validationMessages.required',
  function() {
    const type = this.get('type');

    let schema = yup.string(this.get('validationMessages.dataType'));
    if (type === 'email') {
      schema = schema.email(this.get('validationMessages.email'));
    } else if (type === 'url') {
      schema = schema.url(this.get('validationMessages.url'));
    }

    if (this.get('required')) {
      schema = schema.required(this.get('validationMessages.required'));
    }

    return schema;
  }),

  charLimit: 0,
  charLimitErrors: [],
  charLimitSchema: Ember.computed('charLimit', 'validationMessages.charLimit', function() {
    return yup.number().max(this.get('charLimit'), this.get('validationMessages.charLimit'));
  }),
  charRemaining: Ember.computed('value', 'charLimit', function() {
    const charCount = this.get('value.length') || 0;
    return this.get('charLimit') ? this.get('charLimit') - charCount : 0;
  }),
  charLimitValidation: Ember.computed('value', 'charLimitSchema', function() {
    const schema = this.get('charLimitSchema');

    if (!schema) {
      return null;
    }

    const validate = schema.validate(this.get('value.length')).then((value) => {
      const name = this.get('name');
      this.set('charLimitErrors', []);
      if (this.onInput) {
        this.onInput(value);
      }
      return value;
    }).catch((validation) => {
      this.set('charLimitErrors', validation.errors);
      return validation.errors;
    });

    return validate;
  }),
  validateCharLimit: Ember.on('init', Ember.observer('charLimitValidation', function() {
    if (this.get('enabled')) {
      return this.get('charLimitValidation');
    }
  }))
});

export default TextField;
