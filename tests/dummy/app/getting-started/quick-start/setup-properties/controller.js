import Controller from '@ember/controller';
import * as yup from 'yup';
import { computed } from '@ember/object';

export default Controller.extend({
  controllerCode: `
    import Controller from '@ember/controller';
    import * as yup from 'yup';

    export default Controller.extend({
      userSchema: Ember.computed(function() {
        return yup.object().shape({
          username: yup.string().required(),
          age: yup
            .number()
            .required()
            .positive()
            .integer(),
          email: yup.string().email()
        });
      }),
      formData: {},
      errorMessages: [],
      actions: {
        createUser() {
          const data = this.get('formData');
          const validate = this.get('userSchema').validate(data, { abortEarly: false });

          validate.then((data) => {
            this.set('formData', {
              username: '',
              age: '',
              email: ''
            });
            this.set('errorMessages', []);
            this.store.createRecord('user', data);
          }).catch((validation) => {
            this.set('errorMessages', validation.errors);
          });
        }
      }
    });
  `
});
