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
  templateCode: `
    <form {{action "validate" on="submit"}}>
      {{#if isValid}}
        <p>valid</p>
      {{else if didAttemptValidate}}
        <ul>
          {{#each errors as |msg|}}
            <li>{{msg}}</li>
          {{/each}}
        </ul>
      {{/if}}

      {{#each-in formData as |name value|}}
        <div>
          <label for="{{name}}-input">{{name}}</label>
          <div>
            <input
              id="{{name}}-input"
              oninput={{action (mut (get formData name)) value="target.value"}}
              value={{get formData name}}
            >
          </div>
        </div>
      {{/each-in}}

      <footer>
        <button type="submit">validate</button>
      </footer>
    </form>
  `,
  controllerCode: `
    import Controller from '@ember/controller';
    import * as yup from 'yup';

    export default Controller.extend({
      schema: Ember.computed(function() {
        return yup.object().shape({
          username: yup.string().required(),
          age: yup.number().min(18, 'you must be at least \${min} years of age in order to join this app').required(),
          email: yup.string().email().required(),
          countryCode: yup.string().required(),
          zipCode: yup.string().required().matches(/\\d{5}(-?\\d{4})?|\\s*/, 'must be a 5 or 9 digit zip code'),
        });
      }),
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

        Ember.run.next(function() {
          const el = document.getElementById('custom-schema');
          if (el) {
            el.requestUpdate();
          }
        });
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
