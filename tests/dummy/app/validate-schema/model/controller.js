import Controller from '@ember/controller';

export default Controller.extend({
  html: `
    import DS from 'ember-data';
    const { Model } = DS;

    export default Model.extend({
      username: DS.attr(),
      age: DS.attr('number'),
      email: DS.attr(),
    });
  `
});
