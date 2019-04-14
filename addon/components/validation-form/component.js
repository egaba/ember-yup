import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

export default Component.extend({
  layout,
  tagName: 'form',
  fieldMap: {},
  errors: {},

  onSubmit(formData) { /* override */ },
  onReject(errors) { /* override */ },

  submit(e) {
    e.preventDefault();

    const fieldMap = this.get('fieldMap');
    const fieldValidations = {};

    for (const fieldName in fieldMap) {
      const field = fieldMap[fieldName];
      field.set('enabled', true);
      fieldValidations[fieldName] = field.get('validation');
    }

    RSVP.hashSettled(fieldValidations).then((data) => {
      const values = {}, errors = {};

      for (const fieldName in data) {
        if (data[fieldName].value instanceof Array) {
          errors[fieldName] = data[fieldName].value;
        } else {
          values[fieldName] = data[fieldName].value;
        }
      }

      this.set('errors', errors);

      const hasErrors = Object.keys(errors).length;
      if (hasErrors) {
        this.onReject(errors);
      } else {
        this.onSubmit(values);
      }
    });
  },
});
