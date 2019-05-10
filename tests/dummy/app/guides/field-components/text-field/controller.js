import Controller from '@ember/controller';

export default Controller.extend({
  example: 'required',
  queryParams: ['example'],
  requiredDemo: `
    {{#text-field
      showErrorMessages=true
      enabled=true
      required=true
      value=username
      as |field|
    }}
      <input
        placeholder="enter a username"
        type="text"
        value={{username}}
        oninput={{action (mut username) value="target.value"}}
      > *required
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  emailDemo: `
    {{#text-field
      type="email"
      value=emailAddress
      enabled=true
      as |field|
    }}
      <input
        placeholder="Email address"
        type="text"
        value={{emailAddress}}
        oninput={{action (mut emailAddress) value="target.value"}}
      >
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  urlDemo: `
    {{#text-field
      type="url"
      value=url
      enabled=true
      as |field|
    }}
      <input
        placeholder="Enter a URL"
        type="text"
        value={{url}}
        oninput={{action (mut url) value="target.value"}}
      >*must include protocol
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  regexDemo: `
    {{#text-field
      enabled=true
      matches="^\\d{5}(-\\d{4})?$"
      validationMessages=(hash
        matches="must be valid 5-digit or 9-digit zip code xxxxx-xxxx or xxxxx. regex: \${regex}"
      )
      value=zipcode
      as |field|
    }}
      <input
        placeholder="Enter a zip code"
        type="text"
        value={{zipcode}}
        oninput={{action (mut zipcode) value="target.value"}}
      >
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  charLimitDemo: `
    {{#text-field
      enabled=true
      charLimit=10
      value=charLimitText
      validationMessages=(hash
        charLimit="username must be less than 10 characters"
      )
      as |field|
    }}
      <input
        placeholder="Enter a username"
        type="text"
        value={{charLimitText}}
        oninput={{action (mut charLimitText) value="target.value"}}
      > char remaining: {{field.charRemaining}}
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  strictUsername: 'invalid_username',
  stackedDemo: `
    {{#text-field
      showErrorMessages=true
      enabled=true
      matches="^[a-zA-Z0-9]+\$"
      charLimit=14
      value=strictUsername
      validationMessages=(hash
        charLimit="username must be less than 14 characters"
        matches="only letters and numbers are allowed; cannot be blank"
      )
      as |field|
    }}
      <input
        placeholder="Enter a username"
        type="text"
        value={{strictUsername}}
        oninput={{action (mut strictUsername) value="target.value"}}
      > char remaining: {{field.charRemaining}}
      {{#each field.errorMessages as |error|}}
        <p>{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,

  methods: Ember.computed.map('model.methods', function(method) {
    const methodParams = method.get('params').map(function(param) { return param.name; }).join(',');
    const signature = `${method.get('name')}(${methodParams})`;
    return {
      id: method.get('id'),
      name: method.get('name'),
      description: method.get('description'),
      signature: signature,
      params: method.get('params')
    };
  })
  // properties: Ember.computed('model', function() {
  //   const properties = [];
  //   const props = this.get('model.properties');
  //
  //   for (const propName in props) {
  //     const prop = props[propName];
  //
  //     if (!prop.isValidationOption && !prop.isPrivate) {
  //       properties.push(Object.assign({}, prop, { name: propName }));
  //     }
  //   }
  //
  //   return properties;
  // }),
  //
  // privateProps: Ember.computed('model', function() {
  //   const properties = [];
  //   const props = this.get('model.properties');
  //
  //   for (const propName in props) {
  //     const prop = props[propName];
  //
  //     if (prop.isPrivate) {
  //       properties.push(Object.assign({}, prop, { name: propName }));
  //     }
  //   }
  //
  //   return properties;
  // }),
  //
  // validationOptions: Ember.computed('model', function() {
  //   const options = [];
  //   const props = this.get('model.properties');
  //
  //   for (const propName in props) {
  //     const prop = props[propName];
  //
  //     if (prop.isValidationOption) {
  //       options.push(Object.assign({}, prop, { name: propName }));
  //     }
  //   }
  //
  //   return options;
  // }),
  //
  // functions: Ember.computed('model', function() {
  //   const functions = [];
  //   const props = this.get('model.functions');
  //
  //   for (const propName in props) {
  //     const prop = props[propName];
  //
  //     if (!prop.isPrivate) {
  //       functions.push(Object.assign({}, prop, { name: propName }));
  //     }
  //   }
  //
  //   return functions;
  // }),
  //
  // privateFuncs: Ember.computed('model', function() {
  //   const functions = [];
  //   const props = this.get('model.functions');
  //
  //   for (const propName in props) {
  //     const prop = props[propName];
  //
  //     if (prop.isPrivate) {
  //       functions.push(Object.assign({}, prop, { name: propName }));
  //     }
  //   }
  //
  //   return functions;
  // }),
});
