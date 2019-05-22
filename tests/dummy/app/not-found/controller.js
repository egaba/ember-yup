import Controller from '@ember/controller';

export default Controller.extend({
  secondsUntilRedirect: 4,
  isRedirecting: false,
  countdownFnQueue: Ember.A(),
  beginCountdown: Ember.observer('secondsUntilRedirect', function() {
    if (this.get('secondsUntilRedirect') > 0) {
      Ember.run.later(this, function() {
        this.decrementProperty('secondsUntilRedirect');
      }, 1000);
    }
  })
});
