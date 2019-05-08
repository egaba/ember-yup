# ember-yup

Yup is a JavaScript object schema validator and object parser. This is an Ember port of the [Yup validation library](https://github.com/jquense/yup)

This library enables Ember apps to import Yup and includes components that can aid with validating data.

Docs: https://egaba88.github.io/ember-yup/
Yup library playground: https://runkit.com/jquense/yup

## Installation

```sh
$ ember install ember-yup
```

## Validating schemas

Schema validation is the most flexible way to use this library.
See [Yup docs here](https://github.com/jquense/yup).

Here's an example where we validate form data before creating a user.

Demo: https://egaba88.github.io/ember-yup/#/getting-started/quick-start/demo

```js
import Controller from '@ember/controller';
import * as yup from 'yup';

export default Controller.extend({
  userSchema: Ember.computed(function() {
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

In this library, "Form Fields" are components that validate a type of data. Yup can validate `strings`, `numbers`, `booleans`, `dates`, `objects`, and `arrays`. Form fields can operate both standalone or in combination with other form fields within a `validation-form`.

Available validation components:
* `text-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/text-field)
* `number-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/number-field)
* `date-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/date-field)
* `boolean-field` (demos https://egaba88.github.io/ember-yup/#/validation-components/boolean-field)
* `validation-form` (demos https://egaba88.github.io/ember-yup/#/validation-components/validation-form)

### Validating data values

By default, form fields will not begin validating until they are `enabled`.
Fields aggregate error messages in an `errorMessages` array that is passed down with the field.

Pass the `enabled=true` prop to the form field to enable the field.
```html
{{#text-field enabled=true type="email" value=myEmailValue as |field|}}
  <input
    placeholder="Email address"
    type="text"
    value={{myEmailValue}}
    oninput={{action (mut myEmailValue) value="target.value"}}
  />
  {{#each field.errorMessages as |error|}}
    <p class="text-red">{{error}}</p>
  {{/each}}
{{/text-field}}
```

### Customizing validation messages

To override default validation messages, set messages on the `validationMessages` prop as a hash.
Every option has its own message.

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

Default text field validation messages:
```js
validationMessages: {
  dataType: undefined,
  email: undefined,
  url: undefined,
  type: undefined,
  required: undefined,
  charLimit: 'character limit has been exceeded',
  matches: undefined,
}
```

Default number field validation messages:
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

Default date field validation messages:
```js
validationMessages: {
  dataType: undefined,
  required: undefined,
  min: undefined,
  max: undefined,
}
```

Default boolean field validation messages:
```js
validationMessages: {
  dataType: undefined,
  required: undefined,
}
```

Example:
```html
{{#text-field
  validationMessages=(hash
    required="username is required"
  )
  required=true
  value=requiredUsernameValue
  as |field|
}}
  <input
    type="text"
    placeholder="username"
    oninput={{action (mut requiredUsernameValue) value="target.value"}}
    value={{requiredUsernameValue}}
    onblur={{action (mut usernameFieldEnabled) true}}
  > * required
  {{#each field.errorMessages as |error|}}
    <p class="text-red">{{error}}</p>
  {{/each}}
{{/text-field}}
```

### Transforming data

Say you want your controls to set numeric values instead of strings. If you want Yup to cast your data, you'll need to do two things:

1. Add an `onChange` action on the form field component to mutate the field's value
2. Mutate `field.value` on the control instead of the original value

Before:
```html
{{#number-field
  enabled=true
  value=myAgeValue
  positive=true
  integer=true
  as |field|
}}
  <input
    type="text"
    placeholder="Enter your age"
    oninput={{action (mut myAgeValue) value="target.value"}}
    value={{myAgeValue}}
  >
  {{#each field.errorMessages as |error|}}
    <p class="text-red">{{error}}</p>
  {{/each}}
{{/number-field}}
```

```js
$E.get('myAgeValue'); // "23"
typeof $E.get('myAgeValue'); // "string"
```

After:
```html
{{#number-field
  enabled=true
  value=myAgeValue
  positive=true
  integer=true
  onInput=(action (mut myAgeValue))
  as |field|
}}
  <input
    type="text"
    placeholder="Enter your age"
    oninput={{action (mut field.value) value="target.value"}}
    value={{myAgeValue}}
  >
  {{#each field.errorMessages as |error|}}
    <p class="text-red">{{error}}</p>
  {{/each}}
{{/number-field}}
```

```js
$E.get('myAgeValue'); // 23
typeof $E.get('myAgeValue'); // "number"
```

### Validating forms

Form fields can be combined within a `validation-form` to validate data before it is submitted.

In order for form fields to operate within a `validation-form`, **form fields must be passed `name` and `parent` props.**
This allows the form to assign a key to each field that it collects for its data.

### Sync form example

```html
{{#validation-form
  onSuccess=(action "submitForm")
  onReject=(action "rejectForm")
  as |form|
}}
  {{#text-field
    validationMessages=(hash
      required="username is required"
    )
    name="username"
    parent=form
    required=true
    value=formData.username
    as |field|
  }}
    <input
      type="text"
      placeholder="username"
      oninput={{action (mut formData.username) value="target.value"}}
      value={{formData.username}}
    > * required
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
  {{/text-field}}
  {{#number-field
    validationMessages=(hash
      required="age is required"
    )
    name="age"
    parent=form
    integer=true
    positive=true
    required=true
    value=formData.age
    as |field|
  }}
    <input
      type="text"
      placeholder="age"
      oninput={{action (mut formData.age) value="target.value"}}
      value={{formData.age}}
    > * required
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
  {{/number-field}}
  {{#text-field
    parent=form
    name="validationFormEmail"
    value=formData.email
    type="email"
    as |field|
  }}
    <input
      placeholder="email"
      type="text"
      value={{formData.email}}
      oninput={{action (mut formData.email) value="target.value"}}
    >
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
  {{/text-field}}

  {{#if validationFormSuccessData}}
    <div class="my-4">
      success! {{validationFormSuccessData}}
    </div>
  {{/if}}
  <button type="submit">validate</button>
{{/validation-form}}
```

### Async form example

```html
{{#validation-form
  async=true
  onSubmit=(action "submitValidationForm")
  as |form|
}}
  {{#text-field
    validationMessages=(hash
      required="username is required"
    )
    name="username"
    parent=form
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
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
  {{/text-field}}
  {{#number-field
    validationMessages=(hash
      required="age is required"
    )
    name="age"
    parent=form
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
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
  {{/number-field}}
  {{#text-field
    parent=form
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
    {{#each field.errorMessages as |error|}}
      <p class="text-red">{{error}}</p>
    {{/each}}
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

##### Boolean Field
  * `value` any
  * `enabled=true|false` boolean (default: false)
  * `required=true|false` boolean (default: false)
  * `validationMessages` hash/object
  * `onInput` action -> boolean

##### Validation Form
  * `async=true|false` boolean (default: false)
  * `preSubmit` action
  * `onSubmit` action -> hash/object of valid form data (use this for async submission)

Sync submission:
  * `onSuccess` action -> hash/object of valid form data
  * `onReject` action -> hash/object of array of strings (error messages)

#### Output/Yielded props

##### All Form Fields
  * `errorMessages` array of strings
  * `value` the transformed value of the field

## In comparison with `ember-changeset`

Validation libraries have a similar goal in mind: to ensure that only valid data makes its way to the database.

`ember-changeset` ensures that the underlying object always contains valid data and adds a layer between the object and the application,
called a Changeset. `ember-changeset` was developed to circumvent issues caused by components using 2-way binding (such as `{{input}}`). By having the application interface this Changeset layer, it guarantees that only valid data could be set on the underlying object. With `ember-changeset-validations`, Changesets can read ValidationMaps to determine whether changes are valid for a given set of data.

`ember-yup` encourages use of one-way controls and doesn't have an opinion on how data flows in your app. Unlike `ember-changeset`, this library validates **after** values have been updated in the underlying object. Setting invalid data in the local store is okay, just as long as we can get the user to correct it so that valid data is sent with the request. This library embraces usage of observers and computed properties and allows applications to interface directly with the underlying objects/models.

Form validation is not the only place this library can be used. Adding validation to your application objects (such as models) is encouraged.

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
