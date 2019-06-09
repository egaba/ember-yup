/* eslint-disable */
import Ember from 'ember';
import DS from 'ember-data';
import EmberObject from '@ember/object';
import ValidateModelMixin from 'ember-yup/mixins/validate-model';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import * as yup from 'yup';

let errors, record;

let ValidateModelObject = EmberObject.extend(ValidateModelMixin, {
  schema: Ember.computed(function() {
    return yup.object().shape({
      username: yup.mixed().required('username err'),
      age: yup.number().required().min(18),
      email: yup.string().email().required(),
      countryCode: yup.string().oneOf(['US', 'ES', 'JP', 'SK']),
      zipCode: yup.string().required().when('countryCode', {
        is: 'US',
        then: yup.string().matches(/\d{5}(-?\d{4})?/)
      }),
      gender: yup.mixed()
    });
  }),
  toJSON() {
    return {};
  }
});

module('ValidateModel mixin tests', function(hooks) {
  hooks.beforeEach(function() {
    errors = DS.Errors.create();

    record = ValidateModelObject.create({
      errors,
    });
  });

  test('validateSync', function (assert) {
    assert.ok(record);
    assert.equal(record.get('isInvalid'), false, 'record should not be invalid before validating');

    run(() => {
      let didThrow = false, errorMessage;
      try {
        assert.ok(record.validateSync() === false, 'validateSync should return false');
        assert.ok(errors.has('username'), 'errors contains messages for username');
        assert.equal(errors.get('username').length, 1, 'username should have 1 error message');
        assert.ok(errors.has('age'), 'errors contains messages for age');
        assert.equal(errors.get('age').length, 1, 'age should have 1 error message');
      } catch(e) {
        errorMessage = e && e.message || e;
        didThrow = true;
      }

      assert.equal(didThrow, false, `validateSync() should not throw: ${errorMessage}`);
    });

    assert.equal(record.get('isInvalid'), true, 'record should be invalid post-validation');
  });

  test('validateSyncAt', function (assert) {
    assert.ok(record);
    assert.equal(record.get('isInvalid'), false, 'record should not be invalid before validating');

    run(() => {
      let didThrow = false, errorMessage;
      try {
        assert.ok(record.validateSyncAt('username') === false, 'validateSyncAt should return false');
        assert.ok(errors.has('username'), 'errors contains messages for username');
        assert.ok(!errors.has('age'), 'errors should not contain messages for age');
      } catch(e) {
        errorMessage = e && e.message || e;
        didThrow = true;
      }

      assert.equal(didThrow, false, `validateSyncAt() should not throw: ${errorMessage}`);
    });

    assert.equal(record.get('isInvalid'), true, 'record should be invalid post-validation');
  });
});
