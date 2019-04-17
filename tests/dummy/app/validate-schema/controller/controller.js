import Controller from '@ember/controller';

export default Controller.extend({
  html: `
    import Controller from '@ember/controller';
    import * as yup from 'yup';
    import { computed, observer } from '@ember/object';

    export default Controller.extend({
      userSchema: yup.object().shape({
        username: yup.string().required(),
        age: yup
          .number()
          .required()
          .positive()
          .integer(),
        email: yup.string().email(),
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
