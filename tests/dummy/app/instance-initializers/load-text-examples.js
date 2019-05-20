export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');

  store.createRecord('field-template', {
    id: 'text-required',
    required: true,
  });

  store.createRecord('field-template', {
    id: 'text-email',
    required: false,
    subType: 'email'
  });
}

export default {
  initialize
};
