import FormField from 'ember-yup/components/form-field/component';
import { computed, observer } from '@ember/object';
import layout from './template';
import * as yup from 'yup';
import RSVP from 'rsvp';

export default FormField.extend({
  layout,

  defaultValidationMessages: Ember.computed(function() {
    return {
      dataType: undefined,
      email: undefined,
      url: undefined,
      type: undefined,
      required: undefined,
      charLimit: 'character limit has been exceeded',
      matches: undefined,
    };
  }).readOnly(),

  // options
  type: 'string',
  required: false,

  dataSchema: null,

  validation: computed('value', 'enabled', 'dataSchema', 'charLimit', 'charLimitSchema', 'abortEarly', function() {
    if (!this.get('enabled')) {
      return RSVP.resolve(); // TODO: should we reject?
    }

    const abortEarly = this.get('abortEarly');
    const value = this.get('value');
    const validation = {
      data: this.get('dataSchema').validate(value, { abortEarly: abortEarly })
    };

    if (this.get('charLimit') > 0) {
      validation.charLimit = this.get('charLimitSchema').validate(value.length);
    }

    const name = this.get('name');

    return new RSVP.Promise(function(resolve, reject) {
      if (abortEarly) {
        RSVP.hash(validation).then(function(hash) {
          resolve(hash.data);
        }).catch((e) => reject([e]));
      } else {
        RSVP.hashSettled(validation).then(function(hash) {
          let errors = [], returnValue = value, errorMessages = [];

          for (const validationType in hash) {
            const state = hash[validationType].state;
            if (hash[validationType].state === 'rejected') {
              const error = hash[validationType].reason;
              error.type = validationType;
              errors = errors.concat(error);
            } else if (validationType === 'data' && hash[validationType].state === 'fulfilled') {
              returnValue = hash[validationType].value;
            }
          }

          if (errors.length) {
            reject(errors);
          } else {
            resolve(returnValue);
          }
        });
      }
    });
  }),
});
