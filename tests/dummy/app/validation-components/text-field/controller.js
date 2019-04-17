import Controller from '@ember/controller';

export default Controller.extend({
  validUsernameExample: `
    {{#text-field
      required=true
      validationMessages=(hash
        required="name is required"
      )
      value=username
      as |field|
    }}
      <input
        placeholder="username"
        type="text"
        value={{username}}
        oninput={{action (mut username) value="target.value"}}
        onblur={{action field.enable}}
      > *required
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/text-field}}
  `,
  validEmailExample: `
    {{#text-field
      type="email"
      value=validEmail
      required=true
      validationMessages=(hash
        required="email address is required"
      )
      as |field|
    }}
      <input
        placeholder="Email address"
        type="text"
        value={{validEmail}}
        oninput={{action (mut validEmail) value="target.value"}}
        onblur={{action field.enable}}
      > *required
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/text-field}}
  `,
  charLimitExample: `
    {{#text-field
      enabled=true
      charLimit=10
      value=charLimit
      as |field|
    }}
      <input
        placeholder="Short message"
        type="text"
        value={{charLimit}}
        oninput={{action (mut charLimit) value="target.value"}}
      >
      <span>char remaining: {{field.charRemaining}}</span>
      {{#each field.errors as |errorMessage|}}
        <p style="color: red;">{{errorMessage}}</p>
      {{/each}}
    {{/text-field}}
  `,
});
