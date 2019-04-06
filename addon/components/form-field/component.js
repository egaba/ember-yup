import Component from '@ember/component';
import { on } from '@ember/object/evented';
import layout from './template';
import * as yup from 'yup';

/**
 * This component encompasses logic common to data fields.
 */
export default Component.extend({
  layout,

  schema: null,
  value: null,
  validationEnabled: false,

  errorMessage: '',

  isValid: false,
  validation: null,
  validate: Ember.observer('value', 'schema', function() {
    if (this.get('validationEnabled')) {
      const validate = this.get('schema').validate(this.get('value')).then((value) => {
        if (this.onInput) {
          this.onInput(value);
        }
        return name ? { [name]: value } : value;
      });

      this.set('validation', validate);

      validate
        .then(() => {
          this.set('isValid', true);
          this.set('errorMessage', '')
        })
        .catch((err) => {
          this.set('isValid', false);
          this.set('errorMessage', err.message)
        });

      return validate;
    }
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
});
