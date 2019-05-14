import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | number-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{number-field}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#number-field}}
        template block text
      {{/number-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('error message should display for required field with empty string value', async function(assert) {
    this.set('age', '');

    // Template block usage:
    await render(hbs`
      {{#number-field
        required=true
        validationMessages=(hash
          dataType="age is required"
          required="age is required"
        )
        integer=true
        positive=true
        value=age
        as |field|
      }}
        <input
          placeholder="age"
          type="text"
          value={{age}}
          oninput={{action (mut age) value="target.value"}}
        >
        {{#each field.errorMessages as |error|}}
          <p class="text-red">{{error}}</p>
        {{/each}}
      {{/number-field}}
    `);

    assert.equal(this.element.textContent.trim(), 'age is required');
  });
});
