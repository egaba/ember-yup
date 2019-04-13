import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submitValidationForm(data) {
      console.log('submission success', data);
      this.set('validationFormErrors', {});
      this.set('validationFormSuccessData', JSON.stringify(data));
    },
    rejectValidationForm(errors) {
      this.set('validationFormErrors', errors)
      console.log('submission error', errors);
    }
  }
});
