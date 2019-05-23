import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

export default Mixin.create({
  _schema: undefined,
  isValid: false,
  isValidating: false,

  save(options = {}) {
    if (options.validate) {
      return this.validate().then(() => {
        return this._super(options);
      });
    }

    return this._super(options);
  },

  validate() {
    return new RSVP.Promise((resolve, reject) => {
      const errors = this.get('errors');
      const errorsByAttributeName = errors.errorsByAttributeName;

      this.set('isValidating', true);

      const validate = this.get('_schema').validate(this.toJSON(), {
        abortEarly: false
      });

      validate.then((data) => {
        this.set('isValidating', false);

        resolve(data);
      }).catch((validations) => {
        this.set('isValidating', false);

        errorsByAttributeName.forEach(function(k, name) {
          errorsByAttributeName.get(name).clear();
        });

        validations.inner.forEach(function(validation) {
          const attrErrors = errorsByAttributeName.get(validation.path);

          attrErrors.clear();
          attrErrors.addObjects(validation.errors);

          errors.set(validation.path, attrErrors);
        });

        reject(errorsByAttributeName);
      });
    });
  },
});
