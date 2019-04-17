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

You can validate data using these handy validation components as well.
Form fields can operate both standalone or in combination with other form fields within a `validation-form`.

Currently, there are three validation components:
* `text-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/text-field)
* `number-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/number-field)
* `validation-form` (demos https://egaba88.github.io/ember-yup/#/validation-components/validation-form)

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

##### Validation Form
  * `onSubmit` action -> hash/object of valid form data
  * `onReject` action -> hash/object of array of strings (error messages)

#### Output/Yielded props

##### Text Field
  * `errors` array of strings
  * `enable` action to set field `enabled`

##### Number Field
  * `errors` array of strings
  * `enable` action to set field `enabled`

##### Validation Form
  * `errors` hash/object of array of strings (error messages)

### Enabling form fields

By default, form fields will not begin validating until they are `enabled`.
When used within a `validation-form`, all **child form fields of that form will be enabled the first time the form submits.**

Otherwise, to enable the form field, there are two options:
1. Pass `enabled=true` to the form field

```html
  {{#text-field enabled=true value=myTextValue as |field|}}
    <input type="text" value={{myTextValue}} oninput={{action (mut myTextValue) value="target.value"}} />
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
  {{/text-field}}
```

Note: Sending `enable` essentially calls `{{action (mut field.enabled) true}}`

### Displaying error messages
Fields will aggregate its error messages in an `errors` array that is passed down with the field.

```html
{{#text-field
  type="email"
  value=validEmail
  required=true
  validationMessages=(hash
    required="email address is required"
  )
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

### Overriding validation messages
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
  // text field
  validationMessages: {
    dataType: undefined,
    email: undefined,
    url: undefined,
    type: undefined,
    required: undefined,
    charLimit: 'this exceeds the character limit',
  }
```

For number fields, it follows the same suit. Number field validation message keys:
```js
  // number field
  validationMessages: {
    dataType: undefined,
    required: undefined,
    integer: undefined,
    positive: undefined,
    negative: undefined,
    min: undefined,
    max: undefined,
  }
```

### Validating a form

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
  }}
    <input
      type="text"
      placeholder="username"
      oninput={{action (mut validationFormName) value="target.value"}}
      value={{validationFormName}}
    > * required
    {{#if form.errors.username.length}}
      <ul>
        {{#each form.errors.username as |errorMessage|}}
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
  }}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut validationFormAge) value="target.value"}}
      value={{validationFormAge}}
    > * required
    {{#if form.errors.age.length}}
      <ul>
        {{#each form.errors.age as |errorMessage|}}
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
