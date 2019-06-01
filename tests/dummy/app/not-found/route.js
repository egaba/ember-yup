import Route from '@ember/routing/route';

export default Route.extend({

  setupController(controller) {
    controller.beginCountdown();

    Ember.run.later(this, function() {
      // this.transitionTo('yup-playground.new');
      this.transitionTo('getting-started.ember-data');
    }, 4000);
  }
});
