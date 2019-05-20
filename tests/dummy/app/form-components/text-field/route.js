import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    example: {
      refreshModel: true
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      api: this.store.peekRecord('api-class', 'text-field'),
      example: this.store.peekRecord('field-template', `text-${params.example}`),
    });
  }
});
