import Controller from '@ember/controller';

export default Controller.extend({
  example: 'sync',
  queryParams: ['example'],
  asyncDemo: `
    TODO
  `,
  syncDemo: `
    {{#validation-form
      onSuccess=(action "submit")
      onReject=(action "reject")
      as |form|
    }}
      <div>
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
          > <small>*required</small>
          {{#each field.errorMessages as |error|}}
            <p>{{error}}</p>
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
          > <small>*required</small>
          {{#each field.errorMessages as |error|}}
            <p>{{error}}</p>
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
            <p>{{error}}</p>
          {{/each}}
        {{/text-field}}

        {{#if validationFormSuccessData}}
          <div>
            success! {{validationFormSuccessData}}
          </div>
        {{/if}}
        <button type="submit">
          submit
        </button>
      </div>
    {{/validation-form}}
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
  }),
  formData: {},
  actions: {
    submit(data) {
      console.log(data);
    },
    reject(errors) {
      console.error(errors);
    }
  }
});
