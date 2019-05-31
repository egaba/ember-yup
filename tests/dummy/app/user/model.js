import DS from 'ember-data';
const { Model } = DS;
import Validate from 'ember-yup/mixins/validate-model';

export default Model.extend(Validate, {
  username: DS.attr({
    validate: {
      required: true,
    },
  }),
  age: DS.attr('number', {
    validate: {
      required: true,
      min: 18,
    },
  }),
  email: DS.attr('string', {
    validate: {
      type: 'email',
      required: true,
    },
  }),
  countryCode: DS.attr({
    validate: {
      required: true,
      oneOf: ['US', 'ES', 'JP', 'SK']
    },
  }),
  zipCode: DS.attr('string', {
    validate: {
      required: true,
      when: {
        countryCode: {
          is: 'US',
          then: {
            matches: /\d{5}(-?\d{4})?/,
          }
        }
      }
    },
  }),
  gender: DS.attr(),
});
