import Controller from '@ember/controller';
import { map } from '@ember/object/computed';

export default Controller.extend({
  methods: map('model.methods', function(method) {
    const methodParams = method.get('params').map(function(param) { return param.name; }).join(',');
    const signature = `${method.get('name')}(${methodParams})`;
    return {
      id: method.get('id'),
      name: method.get('name'),
      description: method.get('description'),
      signature: signature,
      params: method.get('params'),
      isPrivate: method.get('isPrivate')
    };
  })
});
