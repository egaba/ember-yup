import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('user');
  },

  actions: {
    validate() {
      this.get('currentModel').save({ validate: true }).then(function(data) {
        console.log('route success', data);
      }).catch(function(errors) {
        console.log('route errors', errors.get('messages'));
      });
    }
  }
});
