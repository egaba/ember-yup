import Controller from '@ember/controller';
import * as yup from 'yup';

export default Controller.extend({
  schema: Ember.computed(function() {
    return yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    });
  }),
  name: 'd',
  age: 4,
  actions: {
    submitForm(values) {
      console.log('success: submit form!', values);
    },

    rejectForm(errors) {
      console.log('error: form rejected', errors);
    }
  }
});
