import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import * as yup from 'yup';

const VALIDATION_ALIASES = {
  lt: 'lessThan',
  gt: 'moreThan',
  mt: 'moreThan',
  gte: 'min',
  lte: 'max',
};

const ALLOWABLE_DATA_TYPES = ['mixed', 'text', 'string', 'number', 'boolean', 'bool', 'date', 'array', 'object', undefined];

const DATA_TYPE_ALIASES = {
  'boolean': 'bool',
  'text': 'string',
};

 /**
  * This mixin allows the model to validate values against its schema.
  *
  * @class ValidateModelMixin
  */
export default Mixin.create({
  /**
   * Parses validation options and applies them to the schema.
   *
   * @function _buildSchema
   * @private
   */
  _buildSchema(schema = yup.mixed(), options = {}) {
    schema = schema.nullable();

    for (let optionName in options) {
      optionName = VALIDATION_ALIASES[optionName] || optionName;

      if (!/message|dataType/i.test(optionName)) {
        const config = options[optionName];

        try {
          const typeErrorMessage = options['typeMessage'];
          if (typeErrorMessage) {
            schema = schema.typeError(typeErrorMessage);
          }

          if (optionName === 'of') {
            if (!ALLOWABLE_DATA_TYPES.includes(config.dataType)) {
              throw new TypeError(`Unallowed schema type ${config.dataType}`);
            }

            const dataType = DATA_TYPE_ALIASES[config.dataType] || config.dataType || 'mixed';
            const arrayChildSchema = yup[dataType] && yup[dataType]();

            arrayChildSchemaConfig = Ember.assign({}, config);
            delete arrayChildSchemaConfig.dataType;

            schema = schema.of(this._buildSchema(arrayChildSchema, arrayChildSchemaConfig));
          } else if (optionName === 'when') {
            for (const dependentKey in config) {
              const schemaOptions = config[dependentKey];
              schema = schema[optionName](dependentKey, {
                is: schemaOptions.is,
                then: this._buildSchema(schema.clone(), schemaOptions.then),
                otherwise: this._buildSchema(schema.clone(), schemaOptions.otherwise)
              });
            }
          } else if (typeof schema[optionName] === 'function') {
            const shouldIncludeValue = /oneOf|equals|email|url|integer|positive|negative|moreThan|lessThan|mt|lt|gt|min|max|matches/i.test(optionName); // TODO improve
            let message;

            const messageKey = options[optionName + 'MessageKey'];
            if (messageKey && this.intl) {
              message = this.intl.lookup(messageKey, this.intl.get('locales'), {
                resilient: true
              });
            } else {
              message = options[optionName + 'Message'];
            }

            if (shouldIncludeValue) {
              schema = schema[optionName](config, message);
            } else {
              schema = schema[optionName](message);
            }
          } else if (optionName === 'type' && typeof schema[config] === 'function') {
            const messageKey = options[`${config}MessageKey`] || options['typeMessageKey'];
            let message;

            if (messageKey && this.intl) {
              message = this.intl.lookup(messageKey, this.intl.get('locales'), {
                resilient: true
              });
            } else {
              message = options[`${optionName}Message`] || options[`${config}Message`] || typeErrorMessage;
            }

            schema = schema[config](message);
          } else {
            if (/type|matches|email|url/.test(optionName)) {
              console.warn(optionName, 'option only available for `string` schema type. Define the attribute as a `string`.');
            } else if (/integer|positive|negative|lessThan|moreThan/.test(optionName)) {
              console.warn(optionName, 'option only available for `number` schema type. Define the attribute as a `number`.');
            } else {
              // TODO remove after tests
              console.error('TODO', optionName, schema, config);
            }
          }
        } catch(e) {
          console.error('error', optionName, schema, config); // TODO remove
          console.error(e);
        }
      }
    }

    return schema;
  },
  /**
   * A `yup` schema.
   * @property schema
   */
  schema: Ember.computed(function() {
    const schemaAttrs = {};

    this.eachAttribute((name, attr) => {
      const dataType = attr.type;
      const validationOptions = attr.options && attr.options.validate || {};
      const schema = yup[dataType] && yup[dataType]();

      schemaAttrs[name] = this._buildSchema(schema, validationOptions);
    });

    return yup.object().shape(schemaAttrs);
  }).readOnly(),

 /**
  * Flag to tell whether or not the model is currently validating.
  * @property isValidating
  */
  isValidating: false,

  /**
   * Validate the record's values against the schema.
   * @function validate
   */
  validate(values = this.toJSON(), options = { abortEarly: false }) {
    return new RSVP.Promise((resolve, reject) => {
      this.set('isValidating', true);

      const errors = this.get('errors');
      const schema = this.get('schema');
      const validate = schema.validate(values, options);

      errors.clear();

      validate.then((data) => {
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
   * @function save
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
