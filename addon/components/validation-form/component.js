import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

const mergeFieldData = (accumulator = {}, currentValue) => Object.assign(accumulator, currentValue);

export default Component.extend({
  layout,
  tagName: 'form',
  fieldMap: {},
  errors: [],

  onSubmit(formData) { /* override */ },
  onReject(errors) { /* override */ },

  submit(e) {
    e.preventDefault();

    const fieldMap = this.get('fieldMap');
    const fieldValidations = [];
    for (const fieldName in fieldMap) {
      const field = fieldMap[fieldName];
      const validation = field.get('validation');
      if (!validation) {
        field.set('validationEnabled', true);
        fieldValidations.push(field.get('validation'));
      } else {
        fieldValidations.push(validation);
      }
    }

    RSVP.allSettled(fieldValidations).then((values) => {
      const results = Ember.A(values);
      if (results.isAny('state', 'rejected')) {
        const errors = Ember.A(values.mapBy('reason')).compact();
        this.set('errors', errors);
        this.onReject(errors);
      } else {
        const formData = values.reduce(mergeFieldData);
        this.set('errors', []);
        this.onSubmit(formData);
      }
    });
  },
});
