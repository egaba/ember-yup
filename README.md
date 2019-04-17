# ember-yup

Demo: https://egaba88.github.io/ember-yup/

This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

## Installation

```sh
$ ember install ember-yup
```

## Using the yup library

`import * as yup from 'yup';` in your controllers, components, etc.

Here's an example where we validate form data before creating a user.

Demo: https://egaba88.github.io/ember-yup/#/validate-model

```js
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
```

```html
<form class="" {{action "createUser" on="submit"}}>
  <p>create a new user</p>
  <div class="">
    <label for="username">username</label>
    <input id="username" type="text" value={{formData.username}} oninput={{action (mut formData.username) value="target.value"}}> *required
  </div>
  <div class="">
    <label for="age">age</label>
    <input id="age" type="text" value={{formData.age}} oninput={{action (mut formData.age) value="target.value"}}> *required
  </div>
  <div class="">
    <label for="email">email</label>
    <input id="email" type="text" value={{formData.email}} oninput={{action (mut formData.email) value="target.value"}}>
  </div>
  <button type="submit" name="button">create user</button>
  {{#each errorMessages as |error|}}
    <p style="color: red;">{{error}}</p>
  {{/each}}
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

## Validation Components

See examples here https://egaba88.github.io/ember-yup/

Contributing
------------------------------------------------------------------------------

Sorry, no tests yet. This library is built with passion and laziness. Feel free
to make a PR if you can understand the code enough to help! I would greatly appreciate it :)

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

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
