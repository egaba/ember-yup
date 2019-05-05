import Controller from '@ember/controller';

export default Controller.extend({
  functions: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),

  privateFuncs: Ember.computed('model', function() {
    const functions = [];
    const props = this.get('model.functions');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        functions.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return functions;
  }),
});
