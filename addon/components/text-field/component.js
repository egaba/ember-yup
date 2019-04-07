import Component from 'ember-yup/components/form-field/component';
import layout from './template';
import * as yup from 'yup';

export default Component.extend({
  layout,

  type: 'string',
  required: false,
  emailMessage: undefined,
  urlMessage: undefined,
  requiredMessage: undefined,
  stringMessage: undefined,

  schema: Ember.computed('type', 'required', 'emailMessage', 'urlMessage', 'requiredMessage', 'stringMessage', function() {
    const messages = this.getProperties('emailMessage', 'urlMessage', 'requiredMessage', 'stringMessage');
    const { emailMessage, urlMessage, requiredMessage, stringMessage } = messages;
    const type = this.get('type');

    let schema = yup.string(stringMessage);
    if (type === 'email') {
      schema = schema.email(emailMessage);
    } else if (type === 'url') {
      schema = schema.url(urlMessage);
    }

    if (this.get('required')) {
      schema = schema.required(requiredMessage);
    }

    return schema;
  }),

  charLimit: 0,
  charLimitMessage: undefined,
  charLimitSchema: Ember.computed('charLimit', function() {
    return yup.number().max(this.get('charLimit'), this.get('charLimitMessage'));
  }),
  charRemaining: Ember.computed('value', 'charLimit', function() {
    const charCount = this.get('value.length') || 0;
    return this.get('charLimit') ? this.get('charLimit') - charCount : 0;
  }),
  charValidate: Ember.observer('charRemaining', function() {
    const validate = this.get('charLimitSchema').validate(this.get('value.length'));
    validate
      .then(() => this.set('errorMessage', ''))
      .catch((err) => this.set('errorMessage', err.message));
    return validate;
  }),
});
