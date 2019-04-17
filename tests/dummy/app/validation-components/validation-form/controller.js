import Controller from '@ember/controller';

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
  `,
  actions: {
    submitValidationForm(data) {
      console.log('submission success', data);
      this.set('validationFormErrors', {});
      this.set('validationFormSuccessData', JSON.stringify(data));
    },
    rejectValidationForm(errors) {
      this.set('validationFormErrors', errors);
      this.set('validationFormSuccessData', null);
      console.log('submission error', errors);
    }
  }
});
