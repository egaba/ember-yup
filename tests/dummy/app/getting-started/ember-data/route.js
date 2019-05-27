import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('user');
  },
  setupController(c, m) {
    this._super(...arguments);

    c.set('didAttemptValidate', false);
  }
});
