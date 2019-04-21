# ember-yup

Demo: https://egaba88.github.io/ember-yup/

This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

## Installation

```sh
$ ember install ember-yup
```

## Validating schemas

Schema validation is the most flexible way to use this library. Yup can
validate nested objects, transform data, localize error messages, and much more.
See [Yup docs here](https://github.com/jquense/yup).

Here's an example where we validate form data before creating a user.

Demo: https://egaba88.github.io/ember-yup/#/validate-schema

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

Validating data can be done in the template, using form field components included with this library.
Form fields can operate both standalone or in combination with other form fields within a `validation-form`.

Available validation components:
* `text-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/text-field)
* `number-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/number-field)
* `date-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/date-field)
* `validation-form` (demos https://egaba88.github.io/ember-yup/#/validation-components/validation-form)

### Validating form field values

By default, form fields will not begin validating until they are `enabled`.
Fields aggregate error messages in an `errors` array that is passed down with the field.

To enable the form field, there are two options:

1. Pass `enabled=true` to the form field
```html
{{#text-field enabled=true value=myTextValue as |field|}}
  <input type="text" value={{myTextValue}} oninput={{action (mut myTextValue) value="target.value"}} />
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/text-field}}
```

2. Or, send the `enable` action that is passed down with the field
```html
{{#text-field value=myTextValue as |field|}}
  <input
    type="text"
    value={{myTextValue}}
    oninput={{action (mut myTextValue) value="target.value"}}
    onblur={{action field.enable}}
  />
  {{#each field.errors as |errorMessage|}}
    <p style="color: red;">{{errorMessage}}</p>
  {{/each}}
{{/text-field}}
```

### Customize validation messages

To override default validation messages, there's a `validationMessages` hash that you can override.
Every option has its own message.

For all form fields:
The default data type message can be overridden via `validationMessages=(hash dataType='this field data type is incorrect')`.
If `required=true`, override the message via `validationMessages=(hash required='this field is required')`.

For text fields:
If `type='email'`, override the message via `email` or `type`. For example, both are valid, but `email` takes precedence:
```html
validationMessages=(hash email='this field should be a valid email address')
validationMessages=(hash type='this field should be a valid email address')
```

Similarly, if `type='url'`, override the message via `url` or `type`. For example, both are valid, but `url` takes precedence:
```html
validationMessages=(hash url='this field should be a valid url')
validationMessages=(hash type='this field should be a valid url')
```

If `charLimit > 0`, override the message via `charLimit`: `validationMessages=(hash charLimit='this string is too long')`.

Text field validation message keys:
```js
validationMessages: {
  dataType: undefined,
  email: undefined,
  url: undefined,
  type: undefined,
  required: undefined,
  charLimit: 'this exceeds the character limit',
  matches: undefined,
}
```

Number field validation message keys:
```js
validationMessages: {
  dataType: undefined,
  required: undefined,
  integer: undefined,
  positive: undefined,
  negative: undefined,
  min: undefined,
  max: undefined,
  lt: undefined,
  gt: undefined,
}
```

Date field validation message keys:
```js
validationMessages: {
  dataType: undefined,
  required: undefined,
  min: undefined,
  max: undefined,
}
```

### Validating forms

Form fields can be combined within a `validation-form` to validate data before it is sent.

In order for form fields to operate within a `validation-form`, **form fields must be passed `name` and `form` props.**
This allows the form to assign a key to each field that it collects for its data.

```html
{{#validation-form
  onSubmit=(action "submitValidationForm")
  onReject=(action "rejectValidationForm")
  as |form|
}}
  {{#text-field
    validationMessages=(hash
      required="username is required"
    )
    name="username"
    form=form
    required=true
    value=validationFormName
    as |field|
  }}
    <input
      type="text"
      placeholder="username"
      oninput={{action (mut validationFormName) value="target.value"}}
      value={{validationFormName}}
    > * required
    {{#if field.errors.length}}
      <ul>
        {{#each field.errors as |errorMessage|}}
          <li style="color: red;">{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/text-field}}
  {{#number-field
    validationMessages=(hash
      required="age is required"
    )
    name="age"
    form=form
    integer=true
    positive=true
    required=true
    value=validationFormAge
    as |field|
  }}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut validationFormAge) value="target.value"}}
      value={{validationFormAge}}
    > * required
    {{#if field.errors.length}}
      <ul>
        {{#each field.errors as |errorMessage|}}
          <li style="color: red;">{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/number-field}}
  {{#text-field
    form=form
    name="validationFormEmail"
    value=validationFormEmail
    type="email"
    as |field|
  }}
    <input
      placeholder="email"
      type="text"
      value={{validationFormEmail}}
      oninput={{action (mut validationFormEmail) value="target.value"}}
    >
    {{#if field.errors.length}}
      <ul>
        {{#each field.errors as |errorMessage|}}
          <li style="color: red;">{{errorMessage}}</li>
        {{/each}}
      </ul>
    {{/if}}
  {{/text-field}}

  {{#if validationFormSuccessData}}
    <div class="my-4">
      success! {{validationFormSuccessData}}
    </div>
  {{/if}}
  <button type="submit">validate</button>
{{/validation-form}}
```

See examples here https://egaba88.github.io/ember-yup/#/validation-components/

### Component API

#### Input props: Options/Handlers

##### Text Field
  * `value` any
  * `enabled=true|false` boolean (default: false)
  * `required=true|false` boolean (default: false)
  * `type=string|email|url` string (default: string)
  * `charLimit >= 0` integer (default: 0)
  * `validationMessages` hash/object
  * `onInput` action -> string

##### Number Field
  * `value` any
  * `enabled=true|false` boolean (default: false)
  * `required=true|false` boolean (default: false)
  * `integer=true|false` boolean (default: false)
  * `positive=true|false` boolean (default: false)
  * `negative=true|false` boolean (default: false)
  * `min` number or undefined (default: undefined)
  * `max` number or undefined (default: undefined)
  * `validationMessages` hash/object
  * `onInput` action -> number

##### Date Field
  * `value` any
  * `enabled=true|false` boolean (default: false)
  * `required=true|false` boolean (default: false)
  * `min` date or undefined (default: undefined)
  * `max` date or undefined (default: undefined)
  * `validationMessages` hash/object
  * `onInput` action -> date

##### Validation Form
  * `onSubmit` action -> hash/object of valid form data
  * `onReject` action -> hash/object of array of strings (error messages)

#### Output/Yielded props

##### All Form Fields
  * `errors` array of strings
  * `enable` action to set field `enabled`

##### Validation Form
  * `errors` hash/object of array of strings (error messages)

## In comparison with `ember-changeset`

Validation libraries have a similar goal in mind: to ensure that only valid data makes its way to the database.

To ensure that the underlying object always contains valid data, `ember-changeset` adds a layer between the object and the application,
called a Changeset. `ember-changeset` was developed to circumvent issues caused by components using 2-way binding (such as `{{input}}`). By having the application interface this Changeset layer, it guarantees that only valid data could be set on the underlying object. With `ember-changeset-validations`, Changesets could read ValidationMaps to determine whether changes are valid for a given set of data.

Unfortunately, the Changeset architecture doesn't work well with validating deeply nested data sets or relationships.

`ember-yup` doesn't have an opinion on how data is organized in your app. Unlike `ember-changeset`, this library validates **after** values have been updated in the underlying object. Setting invalid data in the local store is okay, just as long as we can get the user to correct it before the request is sent. This library embraces usage of observers and computed properties and allows applications to interface directly with the underlying objects/models.

## Contributing

Sorry, no tests yet. This library is built with passion and laziness. ;)

Base implementation for form field components is still under development.
Tests will come once I've settled on the base implementation for the form field components.
Until then, components in this library are still actively evolving.

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
