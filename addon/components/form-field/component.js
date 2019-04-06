import Component from '@ember/component';
import layout from './template';
import * as yup from 'yup';

export default Component.extend({
  layout,

  value: '',
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
  form: null,

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

  registerField: Ember.on('didInsertElement', function() {
    if (this.get('form')) {
      this.set(`form.fieldMap.${this.elementId}`, this);
    }
  }),

  unregisterField: Ember.on('willDestroyElement', function() {
    if (this.get('form')) {
      this.set(`form.fieldMap.${this.elementId}`, undefined);
    }
  }),

  // private
  didBlur: false,
  errorMessage: '',

  validate: Ember.observer('value', 'didBlur', function(forceValidation) {
    console.log(this.get('didBlur'), forceValidation);
    if (this.get('didBlur') || forceValidation === true) {
      const validate = this.get('schema').validate(this.get('value')).then((value) => {
        if (this.onInput) {
          this.onInput(value);
        }
        if (this.get('name') && forceValidation) {
          return {
            [this.get('name')]: value
          }
        } else {
          return value;
        }
      });
      validate.then(() => {
        this.set('errorMessage', '');
      }).catch((err) => {
        this.set('errorMessage', err.message);
      });
      return validate;
    }
  }),
});
