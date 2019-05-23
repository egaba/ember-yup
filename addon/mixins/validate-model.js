import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import * as yup from 'yup';

export default Mixin.create({
  schema: Ember.computed(function() {
    const schemaAttrs = {};

    this.eachAttribute((name, attr) => {
      const dataType = attr.type || 'string';
      const validationOptions = attr.options && attr.options.validate || {};
      const messages = validationOptions.messages || {};

      let propSchema = yup[dataType] && yup[dataType]() || yup.mixed();

      for (const propName in validationOptions) {
        if (!/message/.test(propName)) {
          const value = validationOptions[propName];
          const message = messages[value];

          if (propSchema[propName]) {
            const shouldIncludeValue = /lt|gt|min|max|matches/.test(propName);
            if (shouldIncludeValue) {
              propSchema = propSchema[propName](value, message);
            } else {
              propSchema = propSchema[propName](message);
            }
          }
        }
      }

      schemaAttrs[name] = propSchema;
    });

    return yup.object().shape(schemaAttrs);
  }),

  isValidating: false,

  validate(values = this.toJSON(), options = { abortEarly: false }) {
    return new RSVP.Promise((resolve, reject) => {
      this.set('isValidating', true);

      const errors = this.get('errors');
      const validate = this.get('schema').validate(values, options);

      validate.then(() => {
        errors.clear();
        resolve(this);
      }).catch((validations) => {
        validations.inner.forEach(function(validation) {
          errors.add(validation.path, validation.errors);
        });
        reject(errors);
      }).finally(() => {
        this.set('isValidating', false);
      });
    });
  },

  save(options = {}) {
    if (options.validate) {
      return new RSVP.Promise((resolve, reject) => {
        this.validate().then(() => {
          resolve(this._super(options));
        }).catch(reject);
      });
    }

    return this._super(options);
  },
});
