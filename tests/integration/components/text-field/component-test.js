import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | text-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{text-field}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#text-field}}
        template block text
      {{/text-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it should display error message when value is empty string', async function(assert) {
    this.set('username', '');

    // Template block usage:
    await render(hbs`
      {{#text-field
        enabled=true
        required=true
        validationMessages=(hash
          required="username is required"
        )
        value=username
        as |field|
      }}
        <input
          placeholder="username"
          type="text"
          value={{username}}
          oninput={{action (mut username) value="target.value"}}
        >
        {{#each field.errorMessages as |error|}}
          <p class="text-red">{{error}}</p>
        {{/each}}
      {{/text-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'username is required');
  });
});
