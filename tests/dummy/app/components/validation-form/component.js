import Component from '@ember/component';
import layout from './template';
import RSVP from 'rsvp';

/**
 * Later TODO:
 - preSubmit
 - isSubmitting
 - optimization / abortEarly=true errors
 - reset / retain original values
 - make sure passed in values are valid before running form validations
 */

export default Component.extend({
  layout,
  tagName: 'form',
  schema: null,
  values: null,
  errors: {},

  submit(e) {
    e.preventDefault();
    this.evaluateValues().then(this.onSubmit).catch(this.onReject);
  },

  evaluateValues() {
    const props = this.getProperties('schema', 'values');
    const { schema, values } = props;

    return new RSVP.Promise((resolve, reject) => {
      schema.validate(values, { abortEarly: false }).then((castedValues) => {
        this.set('errors', {});
        resolve(castedValues);
      }).catch((err) => {
        const updatedErrors = {};
        err.inner.forEach((error) => {
          updatedErrors[error.path] = error.message;
        });
        this.set('errors', updatedErrors);
        reject(err);
      });
    });
  },

  actions: {
    evaluate() {
      this.evaluateValues();
    }
  }
});
