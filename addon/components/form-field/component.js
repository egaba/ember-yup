import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import RSVP from 'rsvp';
import layout from './template';

/**
 * The base component for FormField components. FormFields are responsible for
 * providing the schema for validating the fields `value`. This base component
 * is responsible for reading the schema for validation and setting up the fields
 * state, such as errors. This component also registers with its parent, if part
 * of a ValidationForm.
 *
 * @class FormField
 */
export default Component.extend({
  layout,

  classNames: ['form-field'],

  init() {
    this._super(...arguments);
    this.readValidation();
  },

  /**
    * Control whether or not validation occurs on the field.
    *
    * @property {Boolean} disabled
    * @defaultValue true
    */
  disabled: true,

  /**
   * Properties that are yielded to the template.
   *
   * @property {Object} state
   * @private
   */
  state: Ember.computed('baseState', 'additionalState', function() {
    const baseState = this.get('baseState');
    const additionalState = this.get('additionalState') || {};
    return Ember.assign({}, baseState, additionalState);
  }),

  /**
   * Field-specific properties that are yielded to the template. Can be overridden
   * by the inheriting FormField component.
   *
   * @property {Object} additionalState
   * @private
   */
  additionalState: null,

  /**
   * Base field properties that are yielded to the template.
   *
   * @property {Object} baseState
   * @private
   */
  baseState: Ember.computed(
    'errorMessages', 'hasErrors', 'didValidate',
    'didValueUpdate', 'didBlur', 'isValid', 'isInvalid', 'isInvalidAfterUpdate',
    'isValidAfterUpdate', 'isDisabled',
  function() {
    return this.getProperties(
      'errorMessages', 'hasErrors', 'didValidate', 'didValueUpdate',
      'didBlur', 'isValid', 'isInvalid', 'isInvalidAfterUpdate', 'isValidAfterUpdate',
      'isDisabled'
    );
  }),

  /**
    * This is a Yup option that gets passed to the schema's validate method, which will fail validation
    * on its first invalid check.
    *
    * @property {Boolean} abortEarly
    * @defaultValue false
    */
  abortEarly: false,

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
      required: '${path} is a required field',
    };
  }),

  /**
    * Mark the schema as required. All field values apart from `undefined` and `null` meet this requirement.
    *
    * @property {Boolean} required
    * @defaultValue false
    */
  required: false,

  /**
    * Set messages on this hash to override the default validation messages.
    *
    * @property {Object} validationMessages
    */
  validationMessages: computed({
    get() {
      return this.get('defaultValidationMessages');
    },
    set(key, messageOverridesHash) {
      const overrides = {};
      for (const key in messageOverridesHash) {
        const message = messageOverridesHash[key];
        if (message) {
          overrides[key] = message;
        }
      }
      return assign({}, this.get('defaultValidationMessages'), overrides);
    },
  }),

  /**
    * The validation result of the latest computed `value`.
    *
    * @property {Promise} validation
    * @private
    */
  validation: computed('value', 'dataSchema', 'abortEarly', function() {
    const abortEarly = this.get('abortEarly');
    const value = this.get('value');
    let validation;
    try {
      validation = {
        data: this.get('dataSchema').validate(value, { abortEarly: abortEarly })
      };
    } catch(e) {
      return RSVP.reject([{ errors: [e.message] }]);
    }

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
    * Flag `true` if there are 1 or more errors.
    *
    * @property {Boolean} hasErrors
    * @yielded
    */
  hasErrors: Ember.computed.gt('errors.length', 0).readOnly(),

  /**
    * Flag `true` if component ran validation.
    *
    * @property {Boolean} didValidate
    * @yielded
    */
  didValidate: false,

  /**
    * Flag `true` if onBlur action was called.
    *
    * @property {Boolean} didBlur
    * @yielded
    */
  didBlur: false,

  /**
    * Array that holds the ValidationErrors emitted by the schema.
    *
    * @property {Array} errors
    * @private
    */
  errors: computed(function() {
    return A();
  }).readOnly(),

  /**
    * Array that proxies the messages from field's `errors`.
    *
    * @property {Array} errorMessages
    * @yielded
    * @state
    */
  errorMessages: computed('errors.@each.errors', function() {
    let errors = [];

    this.get('errors').forEach(function(err) {
      errors = errors.concat(err.errors);
    });

    return errors;
  }).readOnly(),

  /**
    * Flag used to determine if there was input.
    *
    * @property {Boolean} didValueUpdate
    * @yielded
    * @defaultValue false
    */
  didValueUpdate: false,

  /**
    * A field is valid if there are no errors after validating.
    *
    * @property {Boolean} isValid
    * @yielded
    * @defaultValue false
    */
  isValid: Ember.computed('didValidate', 'hasErrors', function() {
    if (!this.get('didValidate')) {
      return false;
    }

    return !this.get('hasErrors');
  }),

  /**
    * Computed from `isValid` && `didValueUpdate`. Useful for implementing
    * valid styles after user input.
    *
    * @property {Boolean} isValidAfterUpdate
    * @yielded
    * @defaultValue false
    */
  isValidAfterUpdate: Ember.computed.and('isValid', 'didValueUpdate'),

  /**
    * A field is not valid if there are errors after validating.
    *
    * @property {Boolean} isInvalid
    * @yielded
    * @defaultValue false
    */
  isInvalid: Ember.computed('didValidate', 'hasErrors', function() {
    if (!this.get('didValidate')) {
      return false;
    }

    return this.get('hasErrors');
  }).readOnly(),

  /**
    * Control whether or not validation occurs on the field.
    *
    * @property {Boolean} isDisabled
    * @yielded
    */
  isDisabled: Ember.computed.alias('disabled'),

  /**
    * Computed from `isInvalid` && `didValueUpdate`. Useful for implementing
    * invalid styles after user input.
    *
    * @property {Boolean} isInvalidAfterUpdate
    * @yielded
    * @defaultValue false
    */
  isInvalidAfterUpdate: Ember.computed.and('isInvalid', 'didValueUpdate'),

  /**
   * If the field is not `disabled`, the field will validate its `value`. If the validation passes,
   * the transformed value will be passed to its `onInput` or `onClick` handlers, if defined.
   * If the validation fails, errors will get added to the `errors` property, which populates
   * the fields `errorMessages`.
   *
   * @function readValidation
   * @private
   */
  readValidation: observer('disabled', 'value', 'dataSchema', function(formField, updatedKeyName) {
    if (!this.get('disabled')) {
      const value = this.get('value');

      if (!this.get('didValueUpdate') && updatedKeyName === 'value') {
        this.set('didValueUpdate', true);
      }

      this.get('validation')
        .then((val) => {
          this.get('errors').clear();
          this.set('didValidate', true);
        })
        .catch((errors) => {
          this.get('errors').clear();
          this.get('errors').addObjects(errors);
          this.set('didValidate', true);
        });
    } else {
      this.set('didValidate', false);
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

  /**
    * Permits Yup to transform the field's value before passing the value through.
    *
    * @property {Boolean} allowTransform
    * @private
    * @defaultValue false
    */
  allowTransform: false,

  debug: false,
  typeOfValue: Ember.computed('value', function() {
    return typeof(this.get('value'));
  }),
  actions: {
    /**
     * deprecating: dont use
     */
    onChange(value) {
      let nextValue = value;

      if (this.get('allowTransform')) {
        const schema = this.get('dataSchema');
        try {
          nextValue = schema.cast(value);
        } catch(e) {
          nextValue = value;
        }
      }

      this.set('value', nextValue);
    },

    /**
     * Clears the value and sets the field into a "new" state.
     *
     * @function onClear
     * @action
     * @yielded
     */
    onClear() {
      this.setProperties({
        value: undefined,
        didBlur: false,
      });

      Ember.run.next(() => {
        this.set('didValueUpdate', false);
      });
    },

    /**
     * Sets the `didBlur` state.
     *
     * @function onBlur
     * @action
     * @yielded
     */
    onBlur() {
      this.set('didBlur', true);
    }
  }
});
