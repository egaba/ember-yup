import Component from 'ember-yup/components/form-field/component';
import * as yup from 'yup';

export default Component.extend({
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
});
