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
  `
});
