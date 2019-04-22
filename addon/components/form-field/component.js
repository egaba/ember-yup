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
   * Collection of error messages.
   */
  // errors: [],

  /**
   * Drives the form field functionality by observing the field's `value`.
   * Sets up the error messages, propagates transform values, and obtains the fields validation.
   */
  // validate: on('init', observer('value', 'enabled', function() {
  //   if (this.get('enabled')) {
  //     return this.get('validation').then((val) => {
  //       if (this.onInput) {
  //         this.onInput(val);
  //       }
  //       this.set('errors', []);
  //     }).catch((errors) => {
  //       this.set('errors', errors);
  //     });
  //   }
  // })),

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
    // if (form && name) {
    //   form.fieldMap[name] = this;
    // }
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
      }
    }
  }
});
