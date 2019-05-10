import { A } from '@ember/array';
import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

/**
 * A ValidationForm is a container for FormField components. By default, validations
 * are async and its fields validations are collected during the form's submission
 * process, invoking `onSubmit` with a hash of its fields validations.
 *
 * @class ValidationForm
 */
export default Component.extend({
  layout,
  tagName: 'form',

  /**
   * After the form submits and has collected its fields validations, sync forms will wait
   * for the validation results and either call `onSuccess` or `onReject` accordingly.
   *
   * @property {Boolean} sync
   * @defaultValue false
   */
  sync: false,

  /**
   * FormFields register themselves with this property when they initialize.
   *
   * @property {Array} formFields
   * @private
   */
  formFields: A(),

  /**
   * FormField errors are proxied to this property.
   *
   * @property {Array} formFields
   * @yielded
   */
  errors: Ember.computed('formFields.@each.errors', function() {
    const errors = {};

    this.get('formFields').forEach(function(field) {
      errors[field.get('name')] = field.get('errors');
    });

    return errors;
  }),

  /**
   * A hashed collection of its FormFields validations, keyed by the fields'
   * `name`.
   */
  validations: Ember.computed('formFields.@each.validation', function() {
    const validations = {};

    this.get('formFields').forEach(function(field) {
      validations[field.get('name')] = field.get('validation');
    });

    return validations;
  }),

  /**
   * This method is invoked when the form submits, providing a hash of its fields'
   * validations.
   *
   * @function onSubmit
   * @param {Object} validations hash of the form fields' validations keyed by the fields' `name`
   * @action
   */
  onSubmit: undefined,

  /**
   * This flag holds the status of whether the form submitted, whether it was successful or not.
   *
   * @property {Boolean} didSubmit
   * @defaultValue false
   * @yielded
   */
  didSubmit: false,

  /**
   * This flag holds the status of whether or not the form has enabled its fields.
   *
   * @property {Boolean} didEnableFields
   * @defaultValue false
   * @private
   */
  didEnableFields: false,

  validationTiming: 0,

  /**
   * This flag holds the status of whether or not the form is validating or not.
   * This property is only for sync forms.
   *
   * @property {Boolean} isValidating
   * @defaultValue false
   * @sync
   * @yielded
   */
  isValidating: false,

  /**
   * This flag holds the status of whether or not the form successfully validated.
   *
   * @property {Boolean} didSucceed
   * @defaultValue false
   * @sync
   * @yielded
   */
  didSucceed: false,

  /**
   * This flag holds the status of whether or not the form unsuccessfully validated.
   *
   * @property {Boolean} didReject
   * @defaultValue false
   * @sync
   * @yielded
   */
  didReject: Ember.computed('didSucceed', 'didSubmit', function() {
    return this.get('didSubmit') && !this.get('didSucceed');
  }),

  /**
   * This method is invoked after the form has successfully validated, returning
   * a hash of the form fields' transformed data.
   *
   * @function onSuccess
   * @param {Object} data hash of the fields' data keyed by the fields' `name`
   * @action
   */
  onSuccess: undefined,

  /**
   * This method is invoked after the form has unsuccessfully validated, returning
   * a hash of hte form fields' ValidationErrors.
   *
   * @function onReject
   * @param {Object} validationErrors hash of the fields' validationErrors keyed by the fields' `name`
   * @action
   */
  onReject: undefined,

  /**
   * This method handles the form's submission process.
   *
   * @function submit
   * @private
   */
  submit(e) {
    e.preventDefault();

    const timeStart = performance.now();

    if (!this.get('didEnableFields')) {
      this.get('formFields').forEach(function(field) {
        field.set('enabled', true);
        field.set('showErrorMessages', true);
      });
      this.set('didEnableFields', true);
    }

    const validations = this.get('validations');

    if (this.onSubmit) {
      this.onSubmit(validations);
    }

    this.set('didSubmit', true);

    if (this.get('sync')) {
      this.set('isValidating', true);

      RSVP.hashSettled(validations).then((fieldValidations) => {
        this.set('validationTiming', performance.now() - timeStart);

        const data = {}, errors = {};
        let hasErrors = false;

        for (const fieldName in fieldValidations) {
          const result = fieldValidations[fieldName];

          if (result.state === 'fulfilled') {
            data[fieldName] = result.value;
            errors[fieldName] = [];
          }

          if (result.state === 'rejected') {
            hasErrors = true;
            errors[fieldName] = result.reason;
          }
        }

        if (hasErrors) {
          this.set('didSucceed', false);
          if (this.onReject) {
            this.onReject(errors);
          }

        } else {
          this.set('didSucceed', true);
          if (this.onSuccess) {
            this.onSuccess(data);
          }
        }

        this.set('isValidating', false);
      });
    } else {
      this.set('validationTiming', performance.now() - timeStart);
    }
  },
});
