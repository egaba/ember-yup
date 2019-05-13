import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    const id = transition.params['yup-playground.edit'].id;
    const record = this.store.peekRecord('field-template', id);

    if (!record) {
      this.store.createRecord('field-template', {
        id: id
      });
    }
  },
  model(params) {
    return this.store.peekRecord('field-template', params.id);
  },
  // setupController(controller, model) {
  //   const initialState = model.getProperties(
  //     'componentName',
  //     'enabled',
  //     'required',
  //     'showErrorMessages',
  //     'requiredValidationMessage',
  //     'value'
  //   );
  //   controller.set('model', model);
  //   controller.set('initialState', initialState);
  //   // controller.setProperties(initialState);
  //   controller.set('formData', initialState);
  // }
});
