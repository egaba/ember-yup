import EmberObject from '@ember/object';
import ValidateModelMixin from 'ember-yup/mixins/schema';
import { module, test } from 'qunit';

module('Unit | Mixin | schema', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ValidateModelObject = EmberObject.extend(ValidateModelMixin);
    let subject = ValidateModelObject.create();
    assert.ok(subject);
  });
});
