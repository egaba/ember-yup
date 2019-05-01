import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import RSVP from 'rsvp';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  init() {
    this._super(...arguments);
    this.readValidation();
  },
  /**
   * The value to evaluate against the schema.
   */
  value: undefined,
  abortEarly: false,

  defaultValidationMessages: computed(function() {
    return {
      dataType: undefined,
      required: undefined,
    };
  }).readOnly(),

  validationMessages: computed('defaultValidationMessages', {
    get() {
      return this.get('defaultValidationMessages');
    },
    set(key, value) {
      return assign({}, this.get('defaultValidationMessages'), value);
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
            if (state === 'rejected') {
              const error = hash[validationType].reason;
              error.type = validationType;
              errors = errors.concat(error);
            } else if (validationType === 'data' && state === 'fulfilled') {
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
  errors: computed(function() {
    return A();
  }),

  errorMessages: computed('errors.@each.errors', function() {
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
});
