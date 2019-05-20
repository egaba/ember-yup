import Route from '@ember/routing/route';

export default Route.extend({
  redirect() {
    const field = this.store.createRecord('field-template', {
      id: (new Date).getUTCMilliseconds(),
      debug: true
    });

    this.transitionTo('yup-playground.edit', field.id);
  }
});
