import FormField from 'ember-yup/components/form-field/component';
import { computed, observer } from '@ember/object';
import { on } from '@ember/object/evented';
import layout from './template';
import * as yup from 'yup';

/**
 * This component is used for validating text values.
 */
export default FormField.extend({
  layout,

  validationMessages: {
    dataType: undefined,
    email: undefined,
    url: undefined,
    type: undefined,
    required: undefined,
    charLimit: 'this exceeds the character limit',
  },

  errors: computed('schemaErrors.[]', 'charLimitErrors.[]', function() {
    return this.get('schemaErrors').concat(this.get('charLimitErrors'));
  }),

  // options
  type: 'string',
  required: false,

  schema: computed(
    'validationMessages.dataType',
    'type', 'validationMessages.email', 'validationMessages.url', 'validationMessages.type',
    'required', 'validationMessages.required',
  function() {
    const type = this.get('type');

    let schema = yup.string(this.get('validationMessages.dataType'));
    if (type === 'email') {
      schema = schema.email(this.get('validationMessages.email') || this.get('validationMessages.type'));
    } else if (type === 'url') {
      schema = schema.url(this.get('validationMessages.url') || this.get('validationMessages.type'));
    }

    if (this.get('required')) {
      schema = schema.required(this.get('validationMessages.required'));
    }

    return schema;
  }),

  charLimit: 0,
  charLimitErrors: [],
  charLimitSchema: computed('charLimit', 'validationMessages.charLimit', function() {
    const charLimit = this.get('charLimit');

    if (charLimit > 0) {
      return yup.number().positive().integer().max(charLimit, this.get('validationMessages.charLimit'));
    }

    return null;
  }),
  charRemaining: computed('value', 'charLimit', function() {
    const charLimit = this.get('charLimit');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return charLimit - charCount;
    }

    return 0;
  }),
  charLimitValidation: computed('value', 'charLimitSchema', function() {
    const schema = this.get('charLimitSchema');

    if (schema) {
      return schema.validate(this.get('value.length')).then((value) => {
        const name = this.get('name');
        this.set('charLimitErrors', []);
        return value;
      }).catch((validation) => {
        this.set('charLimitErrors', validation.errors);
        return validation.errors;
      });
    }

    return null;
  }),
  validateCharLimit: on('init', observer('charLimitValidation', 'enabled', function() {
    if (this.get('enabled')) {
      return this.get('charLimitValidation');
    }
  }))
});
