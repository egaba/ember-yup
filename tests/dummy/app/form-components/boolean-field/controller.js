import Controller from '@ember/controller';

export default Controller.extend({
  example: 'required',
  queryParams: ['example'],

  boolDemo: `
    {{#boolean-field
      showErrorMessages=true
      enabled=true
      required=true
      value=checkboxValue
      as |field|
    }}
      <label>
        <input
          type="checkbox"
          onclick={{action (mut checkboxValue) value="target.checked"}}
          checked={{checkboxValue}}
        >I understand that checking this box will clear the error message.
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
});
