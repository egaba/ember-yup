import Controller from '@ember/controller';
import * as yup from 'yup';
import { computed } from '@ember/object';

export default Controller.extend({
  userSchema: computed(function() {
    return yup.object().shape({
      username: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
      email: yup.string().email(),
    });
  }),
  formData: {},
  errorMessages: [],
  actions: {
    createUser() {
      console.log('a', this.get('formData'));
      this.get('userSchema').validate(this.get('formData'), { abortEarly: false }).then((data) => {
        console.log('b', data);
        this.set('formData', {});
        this.set('errorMessages', []);
        this.store.createRecord('user', data);
      }).catch((validation) => {
        this.set('errorMessages', validation.errors);
      });
    }
  }
});
