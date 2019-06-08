/* eslint-disable */
import Ember from 'ember';
import DS from 'ember-data';
import EmberObject from '@ember/object';
import ValidateModelMixin from 'ember-yup/mixins/validate-model';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import * as yup from 'yup';

let errors, subject;

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

    subject = ValidateModelObject.create({
      errors,
    });
  });

  test('validateSync', function (assert) {
    assert.ok(subject);
    assert.equal(subject.get('isInvalid'), false, 'should not be invalid pre-validation');

    run(() => {
      let hasError = false, errorMessage;
      try {
        let validations = subject.validateSync();

        assert.ok(validations.inner && validations.inner.length > 0, 'should return validation errors');
        assert.equal(validations.inner && validations.inner.length, 4, 'should be 4 validation errors');
        assert.equal(errors.get('username').length, 1, 'errors.username should have an error message');
      } catch(e) {
        errorMessage = e && e.message || e;
        hasError = true;
      }

      assert.equal(hasError, false, `validateSync() should not throw: ${errorMessage}`);
    });

    assert.equal(subject.get('isInvalid'), true, 'subject should be invalid post-validation');
  });

  test('validateSyncAt', function (assert) {
    assert.ok(subject);

    run(() => {
      let hasError = false, errorMessage;
      try {
        let validations = subject.validateSyncAt('username');

        assert.equal(validations.inner && validations.inner.length, 1, 'should be 1 validation error');
        assert.ok(errors.has('username'),  'username should have an error');
        assert.ok(!errors.has('age'), 'there should be no age errors');
      } catch(e) {
        errorMessage = e && e.message || e;
        hasError = true;
      }

      assert.equal(hasError, false, `validateSyncAt() should not throw: ${errorMessage}`);
    });

    assert.equal(subject.get('isInvalid'), true, 'subject should be invalid post-validation');
  });
});
