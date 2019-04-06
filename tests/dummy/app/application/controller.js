import Controller from '@ember/controller';

export default Controller.extend({
  validationFormMessage: '',
  actions: {
    submitValidationForm() {
      this.set('validationFormMessage', 'success!');
    },
    rejectValidationForm() {
      this.set('validationFormMessage', `correct the error(s) and re-submit`);
    }
  }
});
