import Controller from '@ember/controller';
import RSVP from 'rsvp';
export default Controller.extend({
  validationFormExample: `
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
        name="email"
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
  `,
  actions: {
    submitValidationForm(validations) {
      const t0 = performance.now();
      console.log('async', validations);
      RSVP.hashSettled(validations).then(function(data) {
        const t1 = performance.now();
        console.log('async results', data);
        console.log('time', t1 - t0);
      });
    },
  }
});
