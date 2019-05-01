import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | date-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{date-field}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#date-field}}
        template block text
      {{/date-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('error message should display for required field with empty string value', async function(assert) {
    this.set('birthdate', '');

    // Template block usage:
    await render(hbs`
      {{#text-field
        enabled=true
        required=true
        validationMessages=(hash
          required="birthdate is required"
        )
        value=birthdate
        as |field|
      }}
        <input
          placeholder="birthdate"
          type="text"
          value={{birthdate}}
          oninput={{action (mut birthdate) value="target.value"}}
        >
        {{#each field.errorMessages as |error|}}
          <p class="text-red">{{error}}</p>
        {{/each}}
      {{/text-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'birthdate is required');
  });
});
