# ember-yup

Yup is a JavaScript object schema validator and object parser. This is an Ember port of the [Yup Schema library](https://github.com/jquense/yup).

Docs: https://egaba.github.io/ember-yup/

Yup library playground: https://runkit.com/jquense/yup

## Installation

```sh
$ ember install ember-yup
```

## Usage

Here's an example of adding validation to a user model.

Demo: https://egaba.github.io/ember-yup/#/getting-started/ember-data

```js
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
      oneOf: ['US', 'ES', 'JP', 'SK']
    },
  }),
  zipCode: DS.attr('string', {
    validate: {
      required: true,
      when: {
        countryCode: {
          is: 'US',
          then: {
            matches: /\d{5}(-?\d{4})?/,
          }
        }
      }
    },
  }),
  gender: DS.attr(),
});
```

```js
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
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

### Installation

* `git clone <repository-url>`
* `cd ember-yup`
* `npm install`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

## License

This project is licensed under the [MIT License](LICENSE.md).
