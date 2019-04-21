import { observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  value: undefined,
  enabled: false,

  errors: [],

  validate: on('init', observer('value', 'enabled', function() {
    if (this.get('value') === undefined) {
      this.set('errors', []);
    } else if (this.get('enabled')) {
      return this.get('validation').then((val) => {
        if (this.onInput) {
          this.onInput(val);
        }
        this.set('errors', []);
      }).catch((errors) => {
        this.set('errors', errors);
      });
    }
  })),

  form: null,
  name: null,

  didInsertElement() {
    const form = this.get('form'), name = this.get('name');
    if (form && name) {
      form.fieldMap[name] = this;
    }
  },

  willDestroyElement() {
    const form = this.get('form'), name = this.get('name');
    if (form && name) {
      delete form.fieldMap[name];
    }
  },

  actions: {
    enableValidation() {
      if (!this.get('enabled')) {
        this.set('enabled', true);

        if (this.get('value') === undefined) {
          this.set('value', '');
        }
      }
    }
  }
});
