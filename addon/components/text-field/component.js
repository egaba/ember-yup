// import FormField from 'ember-yup/components/form-field/component';
import FormField from '../form-field/component';
import { computed } from '@ember/object';
// import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This component wraps `Yup.string()` and validates string values.
 *
 * @class TextField
 */
export default FormField.extend({

  /**
    * The value of the field.
    *
    * @property {String} value
    */
  value: undefined,

  /**
    * Specify a regex to match the field. Since this is within a template, only
    * the String form of the regex is permitted. ex. "^\d{5}$"
    *
    * @property {String} matches
    */
  matches: undefined,

  /**
    * Set a minimum length limit for the string value.
    * The `${min}` interpolation can be used in the message.
    *
    * @property {Number} min
    */
  min: undefined,

  /**
    * Set a maximum length limit for the string value.
    * The `${max}` interpolation can be used in the message.
    *
    * @property {Number} max
    */
  max: undefined,

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
      email: undefined,
      url: undefined,
      type: undefined,
      required: undefined,
      matches: undefined,
      min: undefined,
      max: undefined,
    };
  }),

  /**
    * The validation subtype.
    *
    * @property {Enum} type string|email|url
    * @defaultValue string
    */
  type: 'string',

  /**
    * The primary schema that determines the fields validity.
    *
    * @property {Object} dataSchema
    * @private
    */
  dataSchema: computed(
    'validationMessages.dataType',
    'type', 'validationMessages.email', 'validationMessages.url', 'validationMessages.type',
    'matches', 'validationMessages.matches',
    'required', 'validationMessages.required',
    'min', 'validationMessages.min',
    'max', 'validationMessages.max',
  function() {
    const type = this.get('type');

    let dataSchema = yup.string();

    if (this.get('validationMessages.dataType')) {
      dataSchema = dataSchema.typeError(this.get('validationMessages.dataType'));
    }

    if (type === 'email') {
      dataSchema = dataSchema.email(this.get('validationMessages.email') || this.get('validationMessages.type'));
    } else if (type === 'url') {
      dataSchema = dataSchema.url(this.get('validationMessages.url') || this.get('validationMessages.type'));
    }

    if (this.get('matches')) {
      const matchesRegex = new RegExp(this.get('matches'));
      dataSchema = dataSchema.matches(matchesRegex, this.get('validationMessages.matches'));
    }

    if (this.get('min')) {
      dataSchema = dataSchema.min(this.get('min'), this.get('validationMessages.min'));
    }

    if (this.get('max')) {
      dataSchema = dataSchema.max(this.get('max'), this.get('validationMessages.max'));
    }

    if (this.get('required')) {
      dataSchema = dataSchema.required(this.get('validationMessages.required'));
    } else {
      dataSchema = dataSchema.notRequired(this.get('validationMessages.required'));
    }

    return dataSchema;
  }),

  /**
    * A yielded property the contains the number of max allowable characters for the
    * length of the `value`.
    *
    * @property {Number} maxCharRemaining
    * @yielded
    */
  maxCharRemaining: computed('value', 'max', function() {
    const charLimit = this.get('max');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return charLimit - charCount;
    }

    return 0;
  }),

  /**
    * A yielded property the contains the number of min allowable characters for the
    * length of the `value`.
    *
    * @property {Number} minCharRemaining
    * @yielded
    */
  minCharRemaining: computed('value', 'min', function() {
    const charLimit = this.get('min');

    if (charLimit > 0) {
      const charCount = this.get('value.length') || 0;
      return Math.max(charLimit - charCount, 0);
    }

    return 0;
  }),

  additionalState: Ember.computed('minCharRemaining', 'maxCharRemaining', function() {
    return this.getProperties('minCharRemaining', 'maxCharRemaining');
  }),
});
