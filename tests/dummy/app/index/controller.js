import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submitValidationForm(data) {
      console.log('submission success', data);
    },
    rejectValidationForm(validation) {
      console.log('submission error', validation);
    }
  }
});
