import Controller from '@ember/controller';
import * as yup from 'yup';
import { computed } from '@ember/object';

export default Controller.extend({
  modelCode: `
    import DS from 'ember-data';
    const { Model } = DS;

    export default Model.extend({
      username: DS.attr(),
      age: DS.attr('number'),
      email: DS.attr()
    });
  `,
  schemaCode: `
    yup.object().shape({
      username: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
      email: yup.string().email()
    });
  `
});
