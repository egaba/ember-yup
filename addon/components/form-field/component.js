import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  /**
   * The value to evaluate against the schema.
   */
  value: undefined,
  abortEarly: false,

  validationMessages: Ember.computed({
    get() {
      return this.get('defaultValidationMessages');
    },
    set(key, value) {
      return Ember.assign({}, this.get('defaultValidationMessages'), value);
    },
  }),

  validation: computed('value', 'enabled', 'dataSchema', 'abortEarly', function() {
    if (!this.get('enabled')) {
      return RSVP.resolve();
    }

    const abortEarly = this.get('abortEarly');
    const value = this.get('value');
    const validation = {
      data: this.get('dataSchema').validate(value, { abortEarly: abortEarly })
    };

    return new RSVP.Promise(function(resolve, reject) {
      if (abortEarly) {
        RSVP.hash(validation).then(function(hash) {
          resolve(hash.data);
        }).catch((e) => {
          reject([e]);
        });
      } else {
        RSVP.hashSettled(validation).then(function(hash) {
          let errors = [], returnValue = value;

          for (const validationType in hash) {
            const state = hash[validationType].state;
            if (hash[validationType].state === 'rejected') {
              const error = hash[validationType].reason;
              error.type = validationType;
              errors = errors.concat(error);
            } else if (validationType === 'data' && hash[validationType].state === 'fulfilled') {
              returnValue = hash[validationType].value;
            }
          }

          if (errors.length) {
            reject(errors);
          } else {
            resolve(returnValue);
          }
        });
      }
    });
  }),

  /**
   * If `true`, allows validation to occur.
   * If `false`, validation will not occur.
   */
  enabled: false,

  /**
   * Collection of error messages.
   */
  errors: Ember.computed(function() {
    return Ember.A();
  }),

  errorMessages: Ember.computed('errors.@each.errors', function() {
    let errors = [];

    this.get('errors').forEach(function(err) {
      errors = errors.concat(err.errors);
    });

    return errors;
  }),

  readValidation: observer('enabled', 'value', function() {
    if (this.get('enabled')) {
      const value = this.get('value');

      this.get('validation')
        .then((val) => {
          if (this.onInput) {
            this.onInput(val);
          }

          this.get('errors').clear();
        })
        .catch((errors) => {
          if (this.onInput) {
            this.onInput(value);
          }
          this.get('errors').clear();
          this.get('errors').addObjects(errors);
        });
    } else {
      this.get('errors').clear();
    }
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
    const parent = this.get('parent');

    if (parent) {
      parent.formFields.addObject(this);
    }
  },

  /**
   * Form teardown.
   */
  willDestroyElement() {
    const parent = this.get('parent');

    if (parent) {
      parent.formFields.removeObject(this);
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
