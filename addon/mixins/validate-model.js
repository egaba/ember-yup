import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

export default Mixin.create({
  isValidating: false,

  validate(values = this.toJSON()) {
    return new RSVP.Promise((resolve, reject) => {
      this.set('isValidating', true);

      const errors = this.get('errors');

      const validate = this.get('_schema').validate(values, {
        abortEarly: false
      });

      validate.then((data) => {
        errors.clear();

        resolve(data);
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
      return this.validate().then(() => {
        return this._super(options);
      });
    }

    return this._super(options);
  },

  _schema: undefined,
});
