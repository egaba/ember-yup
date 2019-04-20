import { observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';

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
      }
    }
  }
});
