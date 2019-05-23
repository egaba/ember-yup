import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('user');
  },

  actions: {
    validate() {
      this.get('currentModel').validate().then(function(data) {
        console.log('siccess', data);
      }).catch(function(validation) {
        console.log(validation);
      });
    }
  }
});
