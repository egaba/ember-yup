import faker from 'faker';
import Controller from '@ember/controller';
import * as yup from 'yup';

export default Controller.extend({
  formData: {
    username: '',
    age: '',
    email: '',
    countryCode: '',
    zipCode: '',
    gender: '',
  },
  errors: Ember.computed(function() {
    return Ember.A();
  }),
  controllerCode: `
    import faker from 'faker';
    import Controller from '@ember/controller';
    import * as yup from 'yup';

    export default Controller.extend({
      formData: {
        username: '',
        age: '',
        email: '',
        countryCode: '',
        zipCode: '',
        gender: '',
      },
      errors: Ember.computed(function() {
        return Ember.A();
      }),
      isValid: false,
      didAttemptValidate: false,
      schema: Ember.computed(function() {
        return yup.object().shape({
          username: yup.string().required(),
          age: yup.number().min(18, 'you must be at least \${min} years of age in order to join this app').required(),
          email: yup.string().email().required(),
          countryCode: yup.string().required(),
          zipCode: yup.string().required().matches(/\\d{5}(-?\\d{4})?|\\s*/, 'must be a 5 or 9 digit zip code'),
        });
      }),
      actions: {
        validate() {
          const errors = this.get('errors');
          errors.clear();
          this.get('schema').validate(this.get('formData'), { abortEarly: false }).then((data) => {
            this.set('isValid', true);
          }).catch((err) => {
            this.set('isValid', false);
            errors.addObjects(err.errors)
          }).finally(() => {
            this.set('didAttemptValidate', true);
          });
        },
        generateFakeData() {
          this.set('didAttemptValidate', false);
          this.set('formData', {
            username: faker.internet.userName(),
            age: faker.random.number({ min: 3, max: 35 }),
            email: faker.internet.email(),
            countryCode: faker.address.countryCode(),
            zipCode: faker.address.zipCode(),
          });
        }
      }
    });
  `,
  isValid: false,
  didAttemptValidate: false,
  schema: Ember.computed(function() {
    return yup.object().shape({
      username: yup.string().required(),
      age: yup.number().min(18, 'you must be at least ${min} years of age in order to join this app').required(),
      email: yup.string().email().required(),
      countryCode: yup.string().required(),
      zipCode: yup.string().required().matches(/\d{5}(-?\d{4})?|\s*/, 'must be a 5 or 9 digit zip code'),
    });
  }),
  actions: {
    validate() {
      const errors = this.get('errors');
      errors.clear();
      this.get('schema').validate(this.get('formData'), { abortEarly: false }).then((data) => {
        this.set('isValid', true);
      }).catch((err) => {
        this.set('isValid', false);
        errors.addObjects(err.errors)
      }).finally(() => {
        this.set('didAttemptValidate', true);
      });
    },
    generateFakeData() {
      this.set('didAttemptValidate', false);
      this.set('formData', {
        username: faker.internet.userName(),
        age: faker.random.number({ min: 3, max: 35 }),
        email: faker.internet.email(),
        countryCode: faker.address.countryCode(),
        zipCode: faker.address.zipCode(),
      });
    }
  }
});
