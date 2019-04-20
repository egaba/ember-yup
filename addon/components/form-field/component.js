import { observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  value: '',
  enabled: false,

  errors: [],

  validate: observer('value', 'enabled', function() {
    if (this.get('enabled')) {
      return this.get('validation').then((val) => {
        if (this.onInput) {
          this.onInput(val);
        }
        this.set('errors', []);
      }).catch((errors) => {
        this.set('errors', errors);
      });
    }
  }),

  form: null,
  name: null,

  registerFieldToForm: on('didInsertElement', function() {
    const form = this.get('form'), name = this.get('name');
    if (form && name) {
      form.fieldMap[name] = this;
    }
  }),

  unregisterFieldFromForm: on('willDestroyElement', function() {
    const form = this.get('form'), name = this.get('name');
    if (form && name) {
      delete form.fieldMap[name];
    }
  }),

  actions: {
    enableValidation() {
      if (!this.get('enabled')) {
        this.set('enabled', true);
      }
    }
  }
});
