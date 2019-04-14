# ember-yup

Demo: https://egaba88.github.io/ember-yup/

This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

**Warning: This is still a major work in progress.** However, I think I've gotten
this library to a decent starting point for most projects.

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

## Validation Components

Validate data without schemas.

### Text validation
The `text-field` component can be used to validate text fields, email addresses, and URLs.

Validate a required username:
```html
{{#text-field
  required=true
  requiredMessage="name is required"
  value=username
  as |field|
}}
  <input
    placeholder="username"
    type="text"
    value={{username}}
    oninput={{action (mut username) value="target.value"}}
    onblur={{action field.enable}}
  > *required
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/text-field}}
```

Validate a required email:
```html
{{#text-field
  type="email"
  value=validEmail
  required=true
  emailMessage="this email address is invalid"
  as |field|
}}
  <input
    placeholder="Email address"
    type="text"
    value={{validEmail}}
    oninput={{action (mut validEmail) value="target.value"}}
    onblur={{action field.enable}}
  > *required
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/text-field}}
```

Char limit:
```html
{{#text-field
  enabled=true
  charLimit=10
  value=charLimit
  as |field|
}}
  <input
    placeholder="Short message"
    type="text"
    value={{charLimit}}
    oninput={{action (mut charLimit) value="target.value"}}
  >
  <span>char remaining: {{field.charRemaining}}</span>
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/text-field}}
```

### Numeric validation
The `number-field` component can be used to validate numbers.

Validate a basic number:
```html
{{#number-field enabled=true value=validatedNumberExample as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedNumberExample) value="target.value"}}
    value={{validatedNumberExample}}
  >
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/number-field}}
```

Validate an integer:
```html
{{#number-field enabled=true value=validatedIntegerExample integer=true as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedIntegerExample) value="target.value"}}
    value={{validatedIntegerExample}}
  >
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/number-field}}
```

Validate a positive integer:
```html
{{#number-field
  enabled=true
  value=validatedAgeExample
  positive=true
  integer=true
  as |field|
}}
  <input
    type="text"
    placeholder="Enter your age"
    oninput={{action (mut validatedAgeExample) value="target.value"}}
    value={{validatedAgeExample}}
  >
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/number-field}}
```

Validate a number between 30-50:
```html
{{#number-field
  enabled=true
  value=validatedRangeExample
  min=30
  max=50
  as |field|
}}
  <input
    type="text"
    placeholder="number range"
    oninput={{action (mut validatedRangeExample) value="target.value"}}
    value={{validatedRangeExample}}
  >
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/number-field}}
```

Cast the value so it's set as an integer.
```html
{{#number-field
  onInput=(action (mut validatedIntegerExample))
  value=validatedIntegerExample
  integer=true
  as |field|
}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut field.value) value="target.value"}}
    onblur={{action field.enable}}
    value={{validatedIntegerExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

### Form validation
The `validation-form` component can be used with the field components to create a validated
form. It will send `onSubmit` and `onReject` actions. `onReject` is optional.

Validation Field components should contain a `name` prop so that their values are correctly mapped
in the form's data.

```html
{{#validation-form
  onSubmit=(action "submitValidationForm")
  onReject=(action "rejectValidationForm")
  as |form|
}}
  {{#text-field requiredMessage="username is required" name="username" form=form required=true value=validationFormName as |field|}}
    <input type="text"
      placeholder="username"
      oninput={{action (mut validationFormName) value="target.value"}}
      value={{validationFormName}}
    > * required
    {{#if form.errors.username.length}}
      <ul>
        {{#each form.errors.username as |errorMessage|}}
          <li>{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/text-field}}
  {{#number-field requiredMessage="age is required" name="age" form=form integer=true positive=true required=true value=validationFormAge as |field|}}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut validationFormAge) value="target.value"}}
      value={{validationFormAge}}
    > * required
    {{#if form.errors.age.length}}
      <ul>
        {{#each form.errors.age as |errorMessage|}}
          <li>{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/number-field}}
  {{#text-field
    form=form
    name="validationFormEmail"
    value=validationFormEmail
    type="email"
    requiredMessage="email is required"
    as |field|
  }}
    <input
      placeholder="email"
      type="text"
      value={{validationFormEmail}}
      oninput={{action (mut validationFormEmail) value="target.value"}}
    >
    {{#if form.errors.validationFormEmail.length}}
      <ul>
        {{#each form.errors.validationFormEmail as |errorMessage|}}
          <li>{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/text-field}}
  <button type="submit">validate</button>
{{/validation-form}}
```

```js
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submitValidationForm(data) {
      console.log('submission success', data);
    },
    rejectValidationForm(errors) {
      console.log('submission error', errors);
    }
  }
});
```

Contributing
------------------------------------------------------------------------------

This is still a major work in progress. **There aren't any tests yet...** but feel
free to make a PR if you can understand the code enough to help! I would greatly appreciate it :)

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
