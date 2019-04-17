import Controller from '@ember/controller';

export default Controller.extend({
  basicNumberExample: `
    {{#number-field enabled=true value=validatedNumberExample as |field|}}
      <input
        type="text"
        placeholder="Enter a number"
        oninput={{action (mut validatedNumberExample) value="target.value"}}
        value={{validatedNumberExample}}
      >
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  integerExample: `
    {{#number-field enabled=true value=validatedIntegerExample integer=true as |field|}}
      <input
        type="text"
        placeholder="Enter a number"
        oninput={{action (mut validatedIntegerExample) value="target.value"}}
        value={{validatedIntegerExample}}
      >
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  positiveIntegerExample: `
    {{#number-field
      enabled=true
      value=validatedAgeExample
      positive=true
      integer=true
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter your age"
        oninput={{action (mut validatedAgeExample) value="target.value"}}
        value={{validatedAgeExample}}
      >
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  numberRangeExample: `
    {{#number-field
      enabled=true
      value=validatedRangeExample
      min=30
      max=50
      as |field|
    }}
      <input
        type="text"
        placeholder="number range"
        oninput={{action (mut validatedRangeExample) value="target.value"}}
        value={{validatedRangeExample}}
      >
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
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
