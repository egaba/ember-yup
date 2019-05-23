import DS from 'ember-data';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

export default Mixin.create({
  _schema: undefined,
  isValid: false,
  isValidating: false,

  validate() {
    return new RSVP.Promise((resolve, reject) => {
      const errors = this.get('errors');

      this.set('isValidating', true);

      const validate = this.get('_schema').validate(this.toJSON(), { abortEarly: false });

      validate.then((data) => {
        this.set('isValidating', false);
        errors.clear();
        resolve(data);
      }).catch((validations) => {
        this.set('isValidating', false);

        validations.inner.forEach(function(validation) {
          errors.set(validation.path, validation.errors);
        });

        reject(validations.inner);
      });
    });
  },
});
