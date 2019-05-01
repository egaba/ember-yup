import Controller from '@ember/controller';

export default Controller.extend({
  agreedToTerms: true,

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
});
