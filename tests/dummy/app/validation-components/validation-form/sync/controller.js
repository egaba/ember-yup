import Controller from '@ember/controller';
import RSVP from 'rsvp';
export default Controller.extend({
  validationFormExample: `
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
  `,
  actions: {
    submitValidationForm(result) {
      result.then(function(data) {
        debugger;
      }).catch(function(errors) {
        debugger;
      });
    },
  }
});
