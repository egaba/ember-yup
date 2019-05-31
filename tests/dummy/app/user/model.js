import DS from 'ember-data';
const { Model } = DS;
import Validate from 'ember-yup/mixins/schema';
import * as yup from 'yup';

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
      minMessage: 'must be at least ${min} years old'
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
    },
  }),
  zipCode: DS.attr('string', {
    validate: {
      required: true,
      when: {
        countryCode: {
          is: 'us',
          then: {
            matches: /\d{5}(-?\d{4})?/,
            matchesMessage: 'must be valid 5 or 9 digit zip code'
          }
        }
      }
    },
  }),
  gender: DS.attr(),
});
