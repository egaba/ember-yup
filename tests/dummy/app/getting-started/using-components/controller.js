import Controller from '@ember/controller';

export default Controller.extend({
  formFieldBasicsSnippet: `
    {{#text-field disabled=false type="email" value=myEmailValue as |field|}}
      <input
        placeholder="Email address"
        type="text"
        value={{myEmailValue}}
        oninput={{action (mut myEmailValue) value="target.value"}}
      />
      {{#each field.errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  overrideMessagesSnippet: `
    {{#text-field
      required=true
      disabled=false
      type="email"
      value=customEmailMessageValue
      validationMessages=(hash
        email="❌ this is an invalid email"
        required="❌ this field is required"
      )
      as |field|
    }}
      <input
        placeholder="Email address"
        type="text"
        value={{customEmailMessageValue}}
        oninput={{action (mut customEmailMessageValue) value="target.value"}}
      />
      {{#each field.errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
    {{/text-field}}
  `,
  textValidationMessages: `
    validationMessages: {
      dataType: undefined,
      email: undefined,
      url: undefined,
      type: undefined,
      required: undefined,
      charLimit: 'character limit has been exceeded',
      matches: undefined,
    }
  `,
  numberValidationMessages: `
    validationMessages: {
      dataType: undefined,
      required: undefined,
      integer: undefined,
      positive: undefined,
      negative: undefined,
      min: undefined,
      max: undefined,
      lt: undefined,
      gt: undefined,
    }
  `,
  dateValidationMessages: `
    validationMessages: {
      dataType: undefined,
      required: undefined,
      min: undefined,
      max: undefined,
    }
  `,
  boolValidationMessages: `
    validationMessages: {
      dataType: undefined,
      required: undefined,
    }
  `,
  beforeTransformExample: `
    {{#number-field
      disabled=false
      value=myAgeValue
      positive=true
      integer=true
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter your age"
        oninput={{action (mut myAgeValue) value="target.value"}}
        value={{myAgeValue}}
      >
      {{#each field.errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
    {{/number-field}}
  `,
  beforeTransformConsole: `
    $E.get('myAgeValue'); // "23"
    typeof $E.get('myAgeValue'); // "string"
  `,
  afterTransformExample: `
    {{#number-field
      disabled=false
      value=myAgeValue
      positive=true
      integer=true
      onChange=(action (mut myAgeValue))
      as |field|
    }}
      <input
        type="text"
        placeholder="Enter your age"
        oninput={{action (mut field.value) value="target.value"}}
        value={{myAgeValue}}
      >
      {{#each field.errorMessages as |error|}}
        <p class="text-red">{{error}}</p>
      {{/each}}
    {{/number-field}}
  `,
  afterTransformConsole: `
    $E.get('myAgeValue'); // 23
    typeof $E.get('myAgeValue'); // "number"
  `
});
