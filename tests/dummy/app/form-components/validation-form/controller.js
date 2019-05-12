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
      <wired-card class="bg-grey-lightest">
        <div style="min-height: 250px;">
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
            <wired-input
              type="text"
              placeholder="username"
              oninput={{action (mut formData.username) value="target.value"}}
              value={{formData.username}}
            ></wired-input> <small>*required</small>
            {{#each field.errorMessages as |error|}}
              <p class="text-red-dark mb-0">{{error}}</p>
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
            <wired-input
              type="text"
              placeholder="age"
              oninput={{action (mut formData.age) value="target.value"}}
              value={{formData.age}}
            ></wired-input> <small>*required</small>
            {{#each field.errorMessages as |error|}}
              <p class="text-red-dark mb-0">{{error}}</p>
            {{/each}}
          {{/number-field}}
          {{#text-field
            parent=form
            name="validationFormEmail"
            value=formData.email
            type="email"
            as |field|
          }}
            <wired-input
              placeholder="email"
              type="text"
              value={{formData.email}}
              oninput={{action (mut formData.email) value="target.value"}}
            ></wired-input>
            {{#each field.errorMessages as |error|}}
              <p class="text-red-dark mb-0">{{error}}</p>
            {{/each}}
          {{/text-field}}

          {{#if validationFormSuccessData}}
            <div class="my-4">
              success! {{validationFormSuccessData}}
            </div>
          {{/if}}
          <button type="submit" class="bg-green-lightest mt-8">
            <wired-button>submit</wired-button>
          </button>
        </div>
      </wired-card>
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