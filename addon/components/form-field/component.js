import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import RSVP from 'rsvp';

/**
 * The base component for all form fields.
 *
 * @class FormField
 */
export default Component.extend({
  init() {
    this._super(...arguments);

    if (this.get('validateOnInit')) {
      this.readValidation();
    }
  },

  /**
   * Called when the field's value is changed. Returns the transformed data value if valid;
   * otherwise returns the input value.
   * @function onChange
   * @action
   */
  onChange: undefined,

  /**
    * This is a Yup option that gets passed to the schema's validate method, which will fail validation
    * on its first invalid check.
    *
    * @property {Boolean} abortEarly
    */
  abortEarly: false,

  /**
    * DELETE ME
    * Flag to validate the field when the component initializes, as long as the field is `enabled`.
    *
    * @property {Boolean} validateOnInit
    */
  validateOnInit: true,

  /**
    * These are the default validation messages set by the Ember Yup library.
    * Leave the properties `undefined` to allow defaults to be set by Yup.
    *
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
    * Mark the schema as required. All field values apart from `undefined` and `null` meet this requirement.
    *
    * @property {Boolean} required
    * @validationOption
    * @defaultValue false
    */
  required: false,

  /**
    * Set properties on this hash to override the default validation messages.
    *
    * @property {Object} validationMessages
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
    * The validation result of the latest computed `value`.
    *
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
    * Enables validation to occur on the field.
    *
    * @property {Boolean} enabled
    */
  enabled: false,

  /**
    * Array that holds the ValidationErrors emitted by the schema.
    *
    * @property {Array} errors
    * @private
    */
  errors: computed(function() {
    return A();
  }),

  /**
    * Array that proxies the messages from field's `errors`.
    *
    * @property {Array} errorMessages
    * @yielded
    */
  errorMessages: computed('errors.@each.errors', 'showErrorMessages', function() {
    let errors = [];

    if (!this.get('showErrorMessages')) return [];

    this.get('errors').forEach(function(err) {
      errors = errors.concat(err.errors);
    });

    return errors;
  }),

  /**
    * Flag to display error messages.
    *
    * @property {Boolean} showErrorMessages
    * @defaultValue false
    */
  showErrorMessages: false,

  /**
    * Show error messages when the `value` first updates.
    *
    * @property {Boolean} enableErrorMessagesOnUpdate
    */
  enableErrorMessagesOnUpdate: true,

  /**
   * If the field is `enabled`, the field will validate its `value`. If the validation passes,
   * the transformed value will be passed to its `onInput` or `onClick` handlers, if defined.
   * If the validation fails, errors will get added to the `errors` property, which populates
   * the fields `errorMessages`.
   *
   * @function readValidation
   * @private
   */
  readValidation: observer('enabled', 'value', function(formField, updatedKeyName) {
    if (!this.get('showErrorMessages') && this.get('enableErrorMessagesOnUpdate') && updatedKeyName === 'value') {
      this.set('showErrorMessages', true);
    }

    if (this.get('enabled')) {
      const value = this.get('value');

      this.get('validation')
        .then((val) => {
          if (this.onChange) {
            this.onChange(val);
          }

          this.get('errors').clear();
        })
        .catch((errors) => {
          if (this.onChange) {
            this.onChange(value);
          }
          this.get('errors').clear();
          this.get('errors').addObjects(errors);
        });
    } else {
      this.get('errors').clear();
    }
  }),

  /**
   * The immediate parent form component that houses this field. For now, the
   * `validation-form` component is the only component that can house form fields.
   *
   * @property {Component} parent
   */
  parent: null,

  /**
   * The key that's used to serialize the data value.
   *
   * @property {String} name
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
