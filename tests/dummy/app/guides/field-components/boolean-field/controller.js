import Controller from '@ember/controller';

export default Controller.extend({
  example: 'required',
  queryParams: ['example'],

  boolDemo: `
    {{#boolean-field
      showErrorMessages=true
      enabled=true
      required=true
      value=agreedToTerms
      as |field|
    }}
      <label>
        <input
          type="checkbox"
          onclick={{action (mut agreedToTerms) value="target.checked"}}
          checked={{agreedToTerms}}
        >agree to terms?
      </label>
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/boolean-field}}
  `,

  simpleBoolExample: `
    {{#boolean-field enabled=true required=true value=agreedToTerms as |field|}}
      <label>
        <input
          type="checkbox"
          onclick={{action (mut agreedToTerms) value="target.checked"}}
          checked={{agreedToTerms}}
        > agree to terms?
      </label>
      {{#each field.errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
    {{/boolean-field}}
  `,
  properties: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isValidationOption && !prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  privateProps: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  validationOptions: Ember.computed('model', function() {
    const options = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isValidationOption) {
        options.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return options;
  }),

  functions: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),

  privateFuncs: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),
});
