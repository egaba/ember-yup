import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';

export default Component.extend({
  layout,

  tagName: 'form',
  formFields: new Set(),
  async: true,

  submit(e) {
    e.preventDefault();

    const validations = {};

    this.get('formFields').forEach(function(field) {
      validations[field.get('name')] = field.get('validation');
    });

    if (this.get('async')) {
      this.onSubmit(validations);
    } else {
      RSVP.hashSettled(validations).then((fieldValidations) => {
        const data = {};
        let hasErrors = false;

        for (const fieldName in fieldValidations) {
          const result = fieldValidations[fieldName];

          if (result.state === 'fulfilled') {
            data[fieldName] = result.value;
          }

          if (result.state === 'rejected') {
            hasErrors = true;
            data[fieldName] = result.reason;
          }
        }

        this.onSubmit(hasErrors ? RSVP.reject(data) : RSVP.resolve(data));
      });
    }
  },
});
