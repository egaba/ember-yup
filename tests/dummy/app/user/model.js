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
      messages: {
        min: 'you must be at least ${min} years of age in order to join this app',
      },
    },
  }),
  email: DS.attr({
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
  zipCode: DS.attr({
    validate: {
      required: true,
      matches: /\d{5}(-?\d{4})?|\s*/,
      messages: {
        matches: 'must be a 5 or 9 digit zip code',
      }
    },
  }),
  gender: DS.attr(),
});
