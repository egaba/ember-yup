import Controller from '@ember/controller';

export default Controller.extend({
  validationFormMessage: '',
  actions: {
    submitValidationForm() {
      console.log('submission success');
    },
    rejectValidationForm(errors) {
      console.log('submission error');
    }
  }
});
