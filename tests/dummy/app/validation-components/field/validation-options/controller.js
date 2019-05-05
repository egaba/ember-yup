import Controller from '@ember/controller';

export default Controller.extend({
  properties: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (!prop.isValidationOption && !prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  privateProps: Ember.computed('model', function() {
    const properties = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isPrivate) {
        properties.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return properties;
  }),

  validationOptions: Ember.computed('model', function() {
    const options = [];
    const props = this.get('model.properties');

    for (const propName in props) {
      const prop = props[propName];

      if (prop.isValidationOption) {
        options.push(Object.assign({}, prop, { name: propName }));
      }
    }

    return options;
  })
});
