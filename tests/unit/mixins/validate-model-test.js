import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Mixin | ValidateModel', function(hooks) {
 setupTest(hooks);

 test('should validate model', function(assert) {
   const model = run(() => this.owner.lookup('service:store').createRecord('user'));
   run(() => model.validate());

   assert.equal(model.get('isValid'), false, 'model is invalid');
 });
});
