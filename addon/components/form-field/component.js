import Component from '@ember/component';
import { on } from '@ember/object/evented';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';
/**
 * This component encompasses logic common to data fields.
 */
export default Component.extend({
  layout,

  schema: null,
  value: null,
  validationEnabled: false,

  errorMessage: '',

  validation: Ember.computed('validationEnabled', 'value', 'schema', function() {
    if (!this.get('validationEnabled')) {
      return null;
    }

    const validate = this.get('schema').validate(this.get('value')).then((value) => {
      const name = this.get('name');
      if (this.onInput) {
        this.onInput(value);
      }
      return name ? { [name]: value } : value;
    });

    return validate;
  }),

  validate: Ember.observer('validation', function() {
    if (this.get('validationEnabled')) {
      const validate = this.get('validation');

      validate
        .then(() => this.set('errorMessage', ''))
        .catch((err) => this.set('errorMessage', err.message));

      return validate;
    }

    return RSVP.Promise.reject('validation not enabled');
  }),

  // form setup
  form: null,
  name: null,

  registerFieldToForm: on('didInsertElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isPartOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isPartOfForm) {
      form.fieldMap[name] = this;
    }
  }),

  unregisterFieldFromForm: on('willDestroyElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isPartOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isPartOfForm) {
      delete form.fieldMap[name];
    }
  }),

  actions: {
    onBlur() {
      if (!this.get('validationEnabled')) {
        this.set('validationEnabled', true);
        this.validate();
      }
    }
  }
});
