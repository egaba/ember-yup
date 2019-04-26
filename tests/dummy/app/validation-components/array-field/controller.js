import Controller from '@ember/controller';
import * as yup from 'yup';

export default Controller.extend({
  usersSchema: Ember.computed('userSchema', function() {
    return yup.array().of(this.get('userSchema')).required();
  }),

  userSchema: Ember.computed(function() {
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
    validate() {
      this.get('usersSchema').validate(this.get('model')).then(function(data) {
        console.log('valid', data);
      }).catch(function(err) {
        console.error(err);
      });
    },
    createUser() {
      this.get('userSchema').validate(this.get('formData'), { abortEarly: false }).then((data) => {
        this.set('formData', {});
        this.set('errorMessages', []);
        this.store.createRecord('user', data);
      }).catch((validation) => {
        this.set('errorMessages', validation.errors);
      });
    }
  }
});
