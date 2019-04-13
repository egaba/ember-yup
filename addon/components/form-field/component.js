import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import * as yup from 'yup';
import RSVP from 'rsvp';
/**
 * This component encompasses logic common to data fields.
 */
export default Component.extend({
  schema: null,
  value: '',
  enabled: false,

  errors: [],

  validation: computed('enabled', 'value', 'schema', function() {
    if (!this.get('enabled')) {
      return null;
    }

    const validate = this.get('schema').validate(this.get('value')).then((value) => {
      const name = this.get('name');
      this.set('errors', []);
      if (this.onInput) {
        this.onInput(value);
      }
      return value;
    }).catch((validation) => {
      this.set('errors', validation.errors);
      return validation.errors;
    });

    return validate;
  }),

  validate: on('init', observer('validation', function() {
    if (this.get('enabled')) {
      return this.get('validation');
    }
  })),

  // form setup
  form: null,
  name: null,

  registerFieldToForm: on('didInsertElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isPartOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isPartOfForm) {
      form.fieldMap[name] = this;
    }
  }),

  unregisterFieldFromForm: on('willDestroyElement', function() {
    const form = this.get('form');
    const name = this.get('name');
    const isPartOfForm = Ember.isPresent(form) && Ember.isPresent(name);
    if (isPartOfForm) {
      delete form.fieldMap[name];
    }
  }),
});
