import { observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  /**
   * The value to evaluate against the schema.
   */
  value: undefined,

  /**
   * If `true`, allows validation to occur.
   * If `false`, validation will not occur.
   */
  enabled: false,

  /**
   * If `true`, this blocks validation until `value` is defined.
   * If `false`, validation will occur regardless of what `value` is set to.
   */
  presence: true,

  /**
   * Collection of error messages.
   */
  errors: [],

  /**
   * Drives the form field functionality by observing the field's `value`.
   * Sets up the error messages, propagates transform values, and obtains the fields validation.
   */
  validate: on('init', observer('value', 'enabled', 'presence', function() {
    if (this.get('presence') && this.get('value') === undefined) {
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

  /**
   * Parent form.
   */
  form: null,

  /**
   * Used as key for mapping data in parent form.
   */
  name: null,

  /**
   * Form setup.
   */
  didInsertElement() {
    const form = this.get('form'), name = this.get('name');
    if (form && name) {
      form.fieldMap[name] = this;
    }
  },

  /**
   * Form teardown.
   */
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

        if (this.get('presence') && this.get('value') === undefined) {
          this.set('value', '');
        }
      }
    }
  }
});
