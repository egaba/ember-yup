import Component from 'ember-yup/components/form-field/component';
import * as yup from 'yup';

export default Component.extend({
  integer: false,
  positive: false,
  negative: false,
  min: undefined,
  max: undefined,
  required: false,
  requiredMessage: undefined,
  numberMessage: undefined,
  integerMessage: undefined,
  positiveMessage: undefined,
  negativeMessage: undefined,
  minMessage: undefined,
  maxMessage: undefined,

  schema: Ember.computed(function() {
    const messages = this.getProperties(
      'requiredMessage', 'numberMessage', 'integerMessage', 'positiveMessage',
      'negativeMessage', 'minMessage', 'maxMessage'
    );
    const {
      requiredMessage, numberMessage, integerMessage, positiveMessage,
      negativeMessage, minMessage, maxMessage
    } = messages;

    let schema = yup.number(numberMessage);

    if (this.get('integer')) {
      schema = schema.integer(integerMessage);
    }

    if (this.get('positive')) {
      schema = schema.positive(positiveMessage);
    } else if (this.get('negative')) {
      schema = schema.negative(negativeMessage);
    }

    if (this.get('min')) {
      schema = schema.min(this.get('min'), minMessage);
    }

    if (this.get('max')) {
      schema = schema.max(this.get('max'), maxMessage);
    }

    if (this.get('required')) {
      schema = schema.required(requiredMessage);
    }

    return schema;
  }),
});
