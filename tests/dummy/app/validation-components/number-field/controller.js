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
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
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
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
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
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  negativeNumberExample: `
    {{#number-field
      enabled=true
      value=validateNegativeExample
      negative=true
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter a negative number"
        oninput={{action (mut validateNegativeExample) value="target.value"}}
        value={{validateNegativeExample}}
      >
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
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
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  ltExample: `
    {{#number-field
      enabled=true
      value=validatedLessThanExample
      lt=20
      as |field|
    }}
      <input
        type="text"
        placeholder="less than 20 example"
        oninput={{action (mut validatedLessThanExample) value="target.value"}}
        value={{validatedLessThanExample}}
      >
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  gtExample: `
    {{#number-field
      enabled=true
      value=validatedGreaterThanExample
      gt=20
      as |field|
    }}
      <input
        type="text"
        placeholder="greater than 20 example"
        oninput={{action (mut validatedGreaterThanExample) value="target.value"}}
        value={{validatedGreaterThanExample}}
      >
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  minExample: `
    {{#number-field
      enabled=true
      value=validateMinValue
      min=20
      as |field|
    }}
      <input
        type="text"
        placeholder="min number 20"
        oninput={{action (mut validateMinValue) value="target.value"}}
        value={{validateMinValue}}
      >
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
  maxExample: `
    {{#number-field
      enabled=true
      value=validateMaxValue
      max=20
      as |field|
    }}
      <input
        type="text"
        placeholder="max number 20"
        oninput={{action (mut validateMaxValue) value="target.value"}}
        value={{validateMaxValue}}
      >
      {{#each field.errorMessages as |errorMessage|}}
        <p class="text-red">{{errorMessage}}</p>
      {{/each}}
    {{/number-field}}
  `,
});
