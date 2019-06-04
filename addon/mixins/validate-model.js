import Ember from 'ember'
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import * as yup from 'yup';
import { assign } from '@ember/polyfills';
import { computed } from '@ember/object';

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

const DEFAULT_VALIDATE_OPTIONS = {
  abortEarly: false,
  transform: false,
};

 /**
  * This mixin allows the model to validate values against its schema.
  *
  * @class ValidateModelMixin
  */
export default Mixin.create({
  /**
   * Parses validation options and applies them to the schema.
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

            const arrayChildSchemaConfig = assign({}, config);
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
              Ember.Logger.warn(optionName, 'option only available for `string` schema type. Define the attribute as a `string`.');
            } else if (/integer|positive|negative|lessThan|moreThan/.test(optionName)) {
              Ember.Logger.warn(optionName, 'option only available for `number` schema type. Define the attribute as a `number`.');
            }
          }
        } catch(e) {
          Ember.Logger.error(e);
        }
      }
    }

    return schema;
  },

  /**
   * A `yup` schema.
   * @property schema
   */
  schema: computed(function() {
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
   * Flag to tell whether or not the model has field errors.
   * @property isInvalid
   */
  isInvalid: false,

  _preValidate() {
    if (this.preValidate) {
      this.preValidate();
    }
    this.trigger('willValidate');
    this.set('isValidating', true);
    this.get('errors').clear();
  },

  _postValidate(isInvalid = false, data) {
    if (isInvalid) {
      const errors = this.get('errors');
      data.inner.forEach(function(validation) {
        errors.add(validation.path, validation.errors);
      });
    }
    this.setProperties({
      isInvalid,
      isValidating: false,
    });
    this.trigger('didValidate', isInvalid, data);
    if (this.postValidate) {
      this.postValidate();
    }
  },

  /**
   * Validate the record's values against the schema.
   * @function validate
   * @param {Object} validateOptions Options to pass to the schema's `validate` method
   * @param {Object} values The values to validate against; defaults to `this.toJSON()`
   */
  validate(validateOptions = {}, values = this.toJSON()) {
    this._preValidate();

    const options = Ember.assign({}, DEFAULT_VALIDATE_OPTIONS, validateOptions);

    const validateValues = new RSVP.Promise((resolve, reject) => {
      this.get('schema').validate(values, options)
        .then(resolve)
        .catch(reject);
    });

    validateValues.then((transformedValues) => {
      if (options.transform) {
        values = transformedValues;
      }
      this._postValidate(false, values);
    }).catch((validations) => {
      this._postValidate(true, validations);
    });

    return validateValues;
  },

  /**
   * Same as validate, except synchronous.
   * Validate the record's values against the schema.
   * @function validateSync
   * @param {Object} validateOptions Options to pass to the schema's `validate` method
   * @param {Object} values The values to validate against; defaults to `this.toJSON()`
   */
  validateSync(validateOptions = {}, values = this.toJSON()) {
    this._preValidate();

    const options = Ember.assign({}, DEFAULT_VALIDATE_OPTIONS, validateOptions);

    try {
      if (options.transform) {
        values = this.get('schema').validateSync(values, options);
      }
      this._postValidate(false, values);
    } catch(validations) {
      this._postValidate(true, validations);
    }

    return values;
  },

  /**
   * Adds a `validate` option to `save()`.
   * This ensures that only valid data is saved.
   * @function save
   * @param {Object} options `validate` option ensures only valid values are saved
   */
  save(options = {}) {
    if (options.validate) {
      return new RSVP.Promise((resolve, reject) => {
        this.validateSync(options);

        if (this.get('isInvalid')) {
          reject(this);
        } else {
          resolve(this._super(options));
        }
      });
    }

    return this._super(options);
  },
});
