import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';

export default Component.extend({
  layout,

  tagName: 'form',
  formFields: Ember.A(),
  async: true,

  submit(e) {
    e.preventDefault();

    if (this.preSubmit) {
      this.preSubmit();
    }

    const validations = {};

    this.get('formFields').forEach(function(field) {
      field.send('enableValidation');
      validations[field.get('name')] = field.get('validation');
    });

    if (this.get('async')) {
      this.onSubmit(validations);
    } else {
      RSVP.hashSettled(validations).then((fieldValidations) => {
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

        this.onSubmit(hasErrors ? RSVP.reject(errors) : RSVP.resolve(data));
      });
    }
  },
});
