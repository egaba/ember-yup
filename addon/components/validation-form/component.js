import { A } from '@ember/array';
import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

export default Component.extend({
  layout,

  tagName: 'form',
  formFields: A(),
  async: false,

  submit(e) {
    e.preventDefault();

    if (this.preSubmit) {
      this.preSubmit();
    }

    const validations = {};

    this.get('formFields').forEach(function(field) {
      if (!field.get('enabled')) {
        field.set('enabled', true);
      }

      validations[field.get('name')] = field.get('validation');
    });

    if (this.onSubmit) {
      this.onSubmit(validations);
    }

    if (!this.get('async')) {
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

        if (hasErrors) {
          this.onReject(errors)
        } else {
          this.onSuccess(data);
        }
      });
    }
  },
});
