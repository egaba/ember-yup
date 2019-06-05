import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Mixin | ValidateModel', function(hooks) {
  setupTest(hooks);

  test('validateSync should transition record to correct states', function(assert) {
    // const model = run(() => this.owner.lookup('service:store').createRecord('user'));
    //
    // assert.equal(!model.get('isInvalid'), 'new record should not be invalid');
    //
    // run(() => {
    //   model.validateSync();
    // });
    //
    // assert.equal(model.get('isInvalid'), 'record should be invalid after validating');
    // assert.equal(!model.get('isValid'), 'record should not be valid after validating');
  });
});
