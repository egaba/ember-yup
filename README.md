ember-yup
==============================================================================

Play with validation demos on the (Github Page)[https://egaba88.github.io/ember-yup/].

This is an Ember port of the [Yup validation library](https://github.com/jquense/yup).

Installation
------------------------------------------------------------------------------

```
ember install ember-yup
```

Form Validation
------------------------------------------------------------------------------
The `validation-form` component is used in conjunction with field components
to create a validated form.

All fields must be valid before `onSubmit` is called. When using validation
fields with this `validation-form` component, a `name` and `form` must be
provided on the fields so that their values are correctly defined.

In this example, the first field will yield `{ name: <nameValue> }`.
The second value will yield `{ age: <ageValue> }`. If a valid submission occurs,
`onSubmit` will be called with a merged form data object:
```
{
  name: <nameValue>,
  age: <ageValue>
}
```

```hbs
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
  {{#text-field name="name" form=form required=true value=validationFormName as |field|}}
    <input type="text"
      placeholder="name"
      oninput={{action (mut validationFormName) value="target.value"}}
      onblur={{action field.onBlur}}
      value={{validationFormName}}
    > * required
  {{/text-field}}
  {{#number-field name="age" form=form integer=true positive=true required=true value=validationFormAge as |field|}}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut validationFormAge) value="target.value"}}
      onblur={{action field.onBlur}}
      value={{validationFormAge}}
    > * required
  {{/number-field}}
  <button type="submit">validate</button>
{{/validation-form}}
```

I highly recommend building your own components to fully utilize the `yup` validation library.
There are many, MANY more components that could be built from `yup`.

Text Validation
------------------------------------------------------------------------------

The `text-field` component can be used to validate text fields, email addresses,
and URLs.

Validate a required username:
```hbs
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
    onblur={{action field.onBlur}}
  > * this field is required
  {{#if field.errorMessage}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/text-field}}
```

Validate a required email:
```hbs
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
    onblur={{action field.onBlur}}
  > * this field is required
  {{#if field.errorMessage}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/text-field}}
```

Number Validation
------------------------------------------------------------------------------
The `number-field` component can be used to validate numbers.

Validate a basic number:
```hbs
{{#number-field value=validatedNumberExample as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedNumberExample) value="target.value"}}
    onblur={{action field.onBlur}}
    value={{validatedNumberExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate an integer:
```hbs
{{#number-field value=validatedIntegerExample integer=true as |field|}}
  <input
    type="text"
    placeholder="Enter a number"
    oninput={{action (mut validatedIntegerExample) value="target.value"}}
    onblur={{action field.onBlur}}
    value={{validatedIntegerExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate a positive integer:
```hbs
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
    onblur={{action field.onBlur}}
    value={{validatedAgeExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Validate a number between 30-50:
```hbs
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
    onblur={{action field.onBlur}}
    value={{validatedRangeExample}}
  >
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Cast the value so it's set as an integer.
```hbs
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
    onblur={{action field.onBlur}}
    value={{validatedIntegerExample}}
  > * required
  {{#if field.hasError}}
    <p>{{field.errorMessage}}</p>
  {{/if}}
{{/number-field}}
```

Custom usage
------------------------------------------------------------------------------

Import the library into your file and use however you'd like.

```js
import * as yup from 'yup';
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
