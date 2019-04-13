# ember-yup

Play with the validation demos here: https://egaba88.github.io/ember-yup/

This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

**Warning: This is still a major work in progress.**

## Installation

```sh
$ ember install ember-yup
```

After you've installed, `import * as yup from 'yup';` in your controllers, components, etc.

## Using the yup library

Here's an example where we validate form data before creating a record.

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

## Validation Components

Validate data without having to manually define schemas.

### Validate text
The `text-field` component can be used to validate text fields, email addresses,
and URLs.

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
  > * this field is required
  {{#if field.errorMessage}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
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
  > * this field is required
  {{#if field.errorMessage}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/text-field}}
```

### Validate numbers
The `number-field` component can be used to validate numbers.

Validate a basic number:
```html
{{#number-field value=validatedNumberExample as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedNumberExample) value="target.value"}}
    onblur={{action field.enable}}
    value={{validatedNumberExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate an integer:
```html
{{#number-field value=validatedIntegerExample integer=true as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedIntegerExample) value="target.value"}}
    onblur={{action field.enable}}
    value={{validatedIntegerExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate a positive integer:
```html
{{#number-field
  value=validatedAgeExample
  positive=true
  integer=true
  as |field|
}}
  <input
    type="text"
    placeholder="Enter your age"
    oninput={{action (mut validatedAgeExample) value="target.value"}}
    onblur={{action field.enable}}
    value={{validatedAgeExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate a number between 30-50:
```html
{{#number-field
  value=validatedRangeExample
  min=30
  max=50
  as |field|
}}
  <input
    type="text"
    placeholder="number range"
    oninput={{action (mut validatedRangeExample) value="target.value"}}
    onblur={{action field.enable}}
    value={{validatedRangeExample}}
  >
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
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

### Send valid data without
The `validation-form` component is used in conjunction with field components
to create a validated form.

All fields must be valid before `onSubmit` is called. When using validation
fields with this `validation-form` component, a `name` and `form` must be
provided on the fields so that their values are correctly defined.

In this example, the first field will yield `{ name: <nameValue> }`.
The second value will yield `{ age: <ageValue> }`. If a valid submission occurs,
`onSubmit` will be called with a merged form data object:
```js
{
  name: <nameValue>,
  age: <ageValue>
}
```

```html
{{#validation-form
  onSubmit=(action "submitValidationForm")
  onReject=(action "rejectValidationForm")
  as |form|
}}
  {{#if form.errors.length}}
    <ul>
      {{#each form.errors as |error|}}
        <li>{{error.message}}</li>
      {{/each}}
    </ul>
  {{/if}}
  {{#text-field requiredMessage="username is required" name="username" form=form required=true value=validationFormName as |field|}}
    <input type="text"
      placeholder="username"
      oninput={{action (mut validationFormName) value="target.value"}}
      onblur={{action field.enable}}
      value={{validationFormName}}
    > * required
  {{/text-field}}
  {{#number-field requiredMessage="age is required" name="age" form=form integer=true positive=true required=true value=validationFormAge as |field|}}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut validationFormAge) value="target.value"}}
      onblur={{action field.enable}}
      value={{validationFormAge}}
    > * required
  {{/number-field}}
  <button type="submit">validate</button>
{{/validation-form}}
```

Contributing
------------------------------------------------------------------------------

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
