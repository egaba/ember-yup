import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

const mergeValues = (accumulator, currentValue) => Object.assign(accumulator, currentValue);

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
    for (const elementId in fieldMap) {
      const field = fieldMap[elementId];
      field.set('enableValidation', true);
      fieldValidations.push(field.validate());
    }

    RSVP.allSettled(fieldValidations).then((values) => {
      const results = Ember.A(values);
      if (results.isAny('state', 'rejected')) {
        this.onReject(values.mapBy('reason'));
      } else {
        const formData = values.reduce(mergeValues);
        this.onSubmit(formData);
      }
    });
  },
});
