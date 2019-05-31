import faker from 'faker';
import Controller from '@ember/controller';

export default Controller.extend({
  modelExample:`
    import DS from 'ember-data';
    const { Model } = DS;
    import Validate from 'ember-yup/mixins/validate-model';

    export default Model.extend(Validate, {
      username: DS.attr({
        validate: {
          required: true,
        },
      }),
      age: DS.attr('number', {
        validate: {
          required: true,
          min: 18,
        },
      }),
      email: DS.attr('string', {
        validate: {
          type: 'email',
          required: true,
        },
      }),
      countryCode: DS.attr({
        validate: {
          required: true,
          oneOf: ['us', 'es', 'jp']
        },
      }),
      zipCode: DS.attr('string', {
        validate: {
          required: true,
          when: {
            countryCode: {
              is: 'us',
              then: {
                matches: /\\d{5}(-?\\d{4})?/,
              }
            }
          }
        },
      }),
      gender: DS.attr(),
    });
  `,

  actionsExample: `
    actions: {
      validate() {
        this.get('model').validate().then(function(data) {
          console.log('validate success', data);
        }).catch((errors) => {
          console.log('validate errors', errors.get('messages'));
        });
      },
      save() {
        this.get('model').save({ validate: true }).then(function(data) {
          console.log('save success', data);
        }).catch(function(errors) {
          console.log('save errors', errors.get('messages'));
        });
      }
    }
  `,

  templateExample: `
    <form {{action "validate" on="submit"}}>
      <div>
        <label for="username-input">username</label>
        <input
          id="username-input"
          oninput={{action (mut (get model "username")) value="target.value"}}
        >
        {{#each (get model.errors "username") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <div>
        <label for="age-input">age</label>
        <input
          id="age-input"
          oninput={{action (mut (get model "age")) value="target.value"}}
        >
        {{#each (get model.errors "age") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <div>
        <label for="email-input">email</label>
        <input
          id="email-input"
          oninput={{action (mut (get model "email")) value="target.value"}}
        >
        {{#each (get model.errors "email") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <div>
        <label for="countryCode-input">countryCode</label>
        <input
          id="countryCode-input"
          oninput={{action (mut (get model "countryCode")) value="target.value"}}
        >
        {{#each (get model.errors "countryCode") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <div>
        <label for="zipCode-input">zipCode</label>
        <input
          id="zipCode-input"
          oninput={{action (mut (get model "zipCode")) value="target.value"}}
        >
        {{#each (get model.errors "zipCode") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <div>
        <label for="gender-input">gender</label>
        <input
          id="gender-input"
          oninput={{action (mut (get model "gender")) value="target.value"}}
        >
        {{#each (get model.errors "gender") as |error|}}
          <p>{{error.message}}</p>
        {{/each}}
      </div>

      <button type="submit">validate</button>
    </form>
  `,
  isValid: false,
  didAttemptValidate: false,
  actions: {
    validate() {
      this.get('model').validate().then((data) => {
        this.set('isValid', true);
      }).catch((errors) => {
        this.set('isValid', false);
      }).finally(() => {
        this.set('didAttemptValidate', true);

        Ember.run.next(function() {
          const el = document.getElementById('model-mixin');
          if (el) {
            el.requestUpdate();
          }
        });
      });
    },
    save() {
      this.get('model').save({ validate: true }).then(function(data) {
        this.set('didSave', true);
      }).catch((errors) => {
        this.set('didSave', false);
      }).finally(() => {
        this.set('didAttemptSave', true);
      });
    },
    generateFakeData() {
      this.set('didAttemptValidate', false);
      this.get('model').setProperties({
        username: faker.internet.userName(),
        age: faker.random.number({ min: 3, max: 35 }),
        email: faker.internet.email(),
        countryCode: faker.address.countryCode(),
        zipCode: faker.address.zipCode(),
        // dateOfBirth: faker.date.past(18),
      });
    }
  }
});
