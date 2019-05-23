import DS from 'ember-data';
const { Model } = DS;
import Validate from 'ember-yup/mixins/validate-model';
import * as yup from 'yup';

// const schema = yup.object({
//   username: yup.string(),
//   age: yup.number().min(18),
//   email: yup.string().required(),
//   countryCode: yup.string(),
//   zipCode: yup.string(),
//   gender: yup.string()
// });

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
      minMessage: 'you must be at least ${min} years of age in order to join this app',
    },
  }),
  email: DS.attr({
    validate: {
      type: 'email',
      required: true,
    },
  }),
  countryCode: DS.attr({
    defaultValue: 'us',
  }),
  zipCode: DS.attr({
    validate: {
      matches: /\d{5}(-?\d{4})?|\s*/,
      matchesMessage: 'must be a 5 or 9 digit zip code',
    }
  }),
  gender: DS.attr(),
});
