import Controller from '@ember/controller';

export default Controller.extend({
  importSnippet: `
    import * as yup from 'yup'; // for everything
    // or
    import { string, object } from 'yup'; // for only what you need
  `,
  usageSnippet: `
    let yup = require('yup');

    let schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
      email: yup.string().email(),
      website: yup.string().url(),
      createdOn: yup.date().default(function() {
        return new Date();
      }),
    });

    // check validity
    schema
      .isValid({
        name: 'jimmy',
        age: 24,
      })
      .then(function(valid) {
        valid; // => true
      });

    // you can try and type cast objects to the defined schema
    schema.cast({
      name: 'jimmy',
      age: '24',
      createdOn: '2014-09-23T19:25:25Z',
    });
    // => { name: 'jimmy', age: 24, createdOn: Date }
  `
});
