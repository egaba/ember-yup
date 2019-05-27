import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import * as yup from 'yup';

/**
 * This mixin enables the Model to `validate()` its values against its schema.
 */
export default Mixin.create({

  /**
   * This is built from the attributes. Options passed to the attribute will be
   * applied to the schema. eg. `username: DS.attr({ validate: { required: true }})`
   */
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

          if (message) {
            debugger;
          }

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

  /**
   * Flag to tell whether or not the model is currently validating.
   */
  isValidating: false,

  /**
   * Validate the record's values against the schema.
   */
  validate(values = this.toJSON(), options = { abortEarly: false }) {
    return new RSVP.Promise((resolve, reject) => {
      this.set('isValidating', true);

      const errors = this.get('errors');
      const schema = this.get('schema');
      const validate = schema.validate(values, options);

      validate.then(() => {
        errors.clear();
        resolve(this);
      }).catch((validations) => {
        validations.inner.forEach(function(validation) {
          errors.add(validation.path, validation.errors);
        });
        reject(errors, schema);
      }).finally(() => {
        this.set('isValidating', false);
      });
    });
  },

  /**
   * Add `validate` option to validate before saving. This ensures that only
   * valid data is sent when saving.
   */
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
