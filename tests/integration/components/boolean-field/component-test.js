import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | boolean-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{boolean-field}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#boolean-field}}
        template block text
      {{/boolean-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('error message should display for required field with empty string value', async function(assert) {
    this.set('acceptedToS', false);

    // Template block usage:
    await render(hbs`
      {{#boolean-field
        enabled=true
        required=true
        validationMessages=(hash
          required="You must agree to Terms of Service"
        )
        value=acceptedToS
        as |field|
      }}
        <label>
          <input
            checked={{acceptedToS}}
            type="checkbox"
            onclick={{action (mut acceptedToS) value="target.checked"}}
          >
        </label>
        {{#each field.errorMessages as |error|}}
          <p class="text-red">{{error}}</p>
        {{/each}}
      {{/boolean-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'You must agree to Terms of Service');
  });
});
