import Controller from '@ember/controller';

export default Controller.extend({
  usernames: Ember.A(['egaba', 'user2']),

  actions: {
    addUsername(username) {
      this.get('usernames').addObject(undefined);
    },

    submitForm(validation) {
      validation.then(function(data) {
        console.log('success', data);
      }).catch(function(errors) {
        console.log('errors', errors);
      });
    }
  }
});
