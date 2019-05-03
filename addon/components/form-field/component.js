import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import RSVP from 'rsvp';

/**
 * This is the base component for all form fields.
 * @class FormField
 */
export default Component.extend({
  init() {
    this._super(...arguments);
    this.readValidation();
  },

  /**
   * @function onInput
   * @input
   */
  onInput: undefined,

  /**
   * @function onClick
   * @input
   */
  onClick: undefined,

  /**
    * @property {any} value
    * @input
    */
  value: undefined,

  /**
    * @property {Boolean} abortEarly
    * @input
    */
  abortEarly: false,

  /**
    * @property {Object} defaultValidationMessages
    * @private
    */
  defaultValidationMessages: computed(function() {
    return {
      dataType: undefined,
      required: undefined,
    };
  }).readOnly(),

  /**
    * @property {Object} validationMessages
    * @input
    */
  validationMessages: computed('defaultValidationMessages', {
    get() {
      return this.get('defaultValidationMessages');
    },
    set(key, value) {
      return assign({}, this.get('defaultValidationMessages'), value);
    },
  }),

  /**
    * @property {Promise} validation
    * @private
    */
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
    * @property {Boolean} enabled
    * @input
    */
  enabled: false,

  /**
    * @property {Array} errors
    * @private
    */
  errors: computed(function() {
    return A();
  }),

  /**
    * @property {Array} errorMessages
    * @output
    */
  errorMessages: computed('errors.@each.errors', function() {
    let errors = [];

    this.get('errors').forEach(function(err) {
      errors = errors.concat(err.errors);
    });

    return errors;
  }),

  /**
   * @function readValidation
   * @private
   */
  readValidation: observer('enabled', 'value', function() {
    if (this.get('enabled')) {
      const value = this.get('value');

      this.get('validation')
        .then((val) => {
          if (this.onInput) {
            this.onInput(val);
          } else if (this.onClick) {
            this.onClick(val);
          }

          this.get('errors').clear();
        })
        .catch((errors) => {
          if (this.onInput) {
            this.onInput(value);
          } else if (this.onClick) {
            this.onClick(val);
          }
          this.get('errors').clear();
          this.get('errors').addObjects(errors);
        });
    } else {
      this.get('errors').clear();
    }
  }),

  /**
   * @property {component} parent
   * @input
   */
  parent: null,

  /**
   * @property {string} name
   * @input
   */
  name: null,

  didInsertElement() {
    const parent = this.get('parent');

    if (parent) {
      parent.formFields.addObject(this);
    }
  },

  willDestroyElement() {
    const parent = this.get('parent');

    if (parent) {
      parent.formFields.removeObject(this);
    }
  },
});
