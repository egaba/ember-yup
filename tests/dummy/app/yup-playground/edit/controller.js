import Controller from '@ember/controller';

export default Controller.extend({
  fieldValueType: Ember.computed('model.value', function() {
    return typeof(this.get('model.value'));
  }),

  initialState: {},
  formData: {},

  isReloading: false,

  actions: {
    apply() {
      this.set('isReloading', true);
      Ember.run.later(() => {
        this.set('isReloading', false);
      }, 10);
    },
    reset() {
      this.get('model').setProperties(this.get('initialState'));
      this.set('isReloading', true);
      Ember.run.later(() => {
        this.set('isReloading', false);
      }, 10);
    }
  }
});
