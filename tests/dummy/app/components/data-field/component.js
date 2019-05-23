import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  name: undefined,
  value: undefined,
  schema: Ember.computed('model', 'name', function() {
    if (this.get('model') && this.get('name') && this.get(`model.schema.fields.${name}`)) {
      return this.get(`model.schema.fields.${name}`);
    }

    return null;
  }),

  errorMessages: Ember.computed('model.errors', 'name', function() {
    const errors = this.get(`model.errors.${this.get('name')}`);

    return errors;
  })
});
