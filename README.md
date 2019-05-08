# ember-yup

Yup is a JavaScript object schema validator and object parser. This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

This library enables Ember apps to import Yup and includes components that can aid with validating data.

Docs: https://egaba88.github.io/ember-yup/
Yup library playground: https://runkit.com/jquense/yup

## Installation

```sh
$ ember install ember-yup
```

## Usage

Here's an example where we validate form data before creating a user using a schema.

Demo: https://egaba88.github.io/ember-yup/#/getting-started/quick-start/demo

```js
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
```

```html
<form {{action "createUser" on="submit"}}>
  {{#each errorMessages as |error|}}
    <p class="text-red mb-0">{{error}}</p>
  {{/each}}
  <div class="mt-4">
    <label for="username">username</label>
    <input
      id="username"
      type="text"
      value={{formData.username}}
      oninput={{action (mut formData.username) value="target.value"}}
    > *required
  </div>
  <div>
    <label for="age">age</label>
    <input
      id="age"
      type="text"
      value={{formData.age}}
      oninput={{action (mut formData.age) value="target.value"}}
    > *required
  </div>
  <div>
    <label for="email">email</label>
    <input
      id="email"
      type="text"
      value={{formData.email}}
      oninput={{action (mut formData.email) value="target.value"}}
    >
  </div>
  <button type="submit">
    create user
  </button>
</form>
```

```js
// user model
import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  username: DS.attr(),
  age: DS.attr('number'),
  email: DS.attr(),
});
```

## In comparison with `ember-changeset`

Validation libraries have a similar goal in mind: to ensure that only valid data makes its way to the database.

`ember-changeset` ensures that the underlying object always contains valid data and adds a layer between the object and the application, called a Changeset. By having the application interface this Changeset layer, it guarantees that only valid data could be set on the underlying object. With `ember-changeset-validations`, Changesets read ValidationMaps to determine whether changes are valid for a given set of data. This provides a mechanism to track and validate changes before they are applied to the underling objects.

`ember-yup` validates data **after** values have been updated in the underlying object. Whether this data is in a component, controller, or record, this data is still stored locally in the client and the database will not know about these changes (unless you're using a realtime database adapter like EmberFire). By evaluating values after they have changed, this library makes use of observers and computed properties in order to perform its validations.

Also, `ember-changeset` has been around for a while and battle-tested, where this library is still a young pup.

At the end of the day, this library just provides another flavor of validating data before its passed to the database.

## Contributing

### Installation

* `git clone <repository-url>`
* `cd ember-yup`
* `yarn install`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).
