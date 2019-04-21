import Controller from '@ember/controller';

export default Controller.extend({
  validateSimpleDateExample: `
    {{#date-field enabled=true value=validateSimpleDate as |field|}}
      <input
        type="text"
        placeholder="Enter a date"
        oninput={{action (mut validateSimpleDate) value="target.value"}}
        value={{validateSimpleDate}}
      >
      {{#each field.errors as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/date-field}}
  `,
  validate2019DateExample: `
    {{#date-field enabled=true value=validate2019Date min="January 1, 2019" max="December 31, 2019" as |field|}}
      <input
        type="text"
        placeholder="ex. April 20, 2019"
        oninput={{action (mut validate2019Date) value="target.value"}}
        value={{validate2019Date}}
      >
      {{#each field.errors as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/date-field}}
  `,
});
