import DS from 'ember-data';
const { Model } = DS;
import Validation from 'ember-yup/mixins/model-validation';

export default Model.extend(Validation, {
  username: DS.attr(),
  age: DS.attr('number'),
  email: DS.attr(),
});
