import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';
import RSVP from 'rsvp';

/**
 * This is the base component for form fields.
 */
export default Component.extend({
  dataSchema: null,
  value: '',
  enabled: false,

  dataErrors: [],

  errors: computed('dataErrors.[]', function() {
    return this.get('dataErrors');
  }),

  validation: computed('value', 'dataSchema', function() {
    const dataSchema = this.get('dataSchema');

    if (dataSchema) {
      return dataSchema.validate(this.get('value'), { abortEarly: false }).then((value) => {
        const name = this.get('name');
        this.set('dataErrors', []);
        if (this.onInput) {
          this.onInput(value);
        }
        return value;
      }).catch((validation) => {
        this.set('dataErrors', validation.errors);
        return validation.errors;
      });
    }

    return null;
  }),

  validate: on('init', observer('validation', 'enabled', function() {
    if (this.get('enabled')) {
      return this.get('validation');
    }
  })),

  form: null,
  name: null,

  registerFieldToForm: on('didInsertElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isChildOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isChildOfForm) {
      form.fieldMap[name] = this;
    }
  }),

  unregisterFieldFromForm: on('willDestroyElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isChildOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isChildOfForm) {
      delete form.fieldMap[name];
    }
  }),

  actions: {
    enableValidation() {
      if (!this.get('enabled')) {
        this.set('enabled', true);
        this.validate();
      }
    }
  }
});
