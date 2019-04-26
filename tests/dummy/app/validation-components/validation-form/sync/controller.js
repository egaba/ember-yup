import Controller from '@ember/controller';
import RSVP from 'rsvp';
export default Controller.extend({
  formData: {},
  validationFormExample: `
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
        name="email"
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
  `,
  actions: {
    submitForm(data) {
      console.log('sync submit', data);
    },

    rejectForm(errors) {
      console.log('sync errors', errors);
    }
  }
});
