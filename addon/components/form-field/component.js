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
  abortEarly: false,
  /**
   * If `true`, allows validation to occur.
   * If `false`, validation will not occur.
   */
  enabled: false,

  /**
   * Collection of error messages.
   */
  errors: [],

  readErrors: observer('enabled', 'value', function() {
    const name = this.get('name');
    this.get('validation')
      .then((val) => {
        this.set('errors', [])
      })
      .catch((errors) => {
        this.set('errors', errors)
      });
  }),

  /**
   * Parent field or form.
   */
  parent: null,

  /**
   * Used as key for mapping data in parent form.
   */
  name: null,

  /**
   * Form setup.
   */
  didInsertElement() {
    const parent = this.get('parent'), name = this.get('name');

    if (parent && name) {
      parent.formFields.add(this);
    }
  },

  /**
   * Form teardown.
   */
  willDestroyElement() {
    const parent = this.get('parent'), name = this.get('name');

    if (parent && name) {
      parent.formFields.delete(this);
    }
  },

  actions: {
    enableValidation() {
      if (!this.get('enabled')) {
        this.set('enabled', true);

        if (this.get('required') && this.get('value') === undefined) {
          this.set('value', '');
        }
      }
    }
  }
});
