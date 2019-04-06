import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

const mergeFieldData = (accumulator = {}, currentValue) => Object.assign(accumulator, currentValue);

export default Component.extend({
  layout,
  tagName: 'form',
  fieldMap: {},

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
        fieldValidations.push(field.validate());
      } else {
        fieldValidations.push(validation);
      }
    }

    RSVP.allSettled(fieldValidations).then((values) => {
      const results = Ember.A(values);
      if (results.isAny('state', 'rejected')) {
        this.onReject(values.mapBy('reason'));
      } else {
        const formData = values.reduce(mergeFieldData);
        this.onSubmit(formData);
      }
    });
  },
});
