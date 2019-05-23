import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('field-template', {
      componentName: 'number-field',
      minRangeNumber: 5,
      maxRangeNumber: 30,
      description: 'pick a number 5-30',
      required: false,
      dataTypeMessage: 'needs to be a number, you silly goose, you'
    });
  }
});
