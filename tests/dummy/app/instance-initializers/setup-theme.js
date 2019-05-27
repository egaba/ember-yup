

export function initialize(appInstance) {
  const theme = appInstance.lookup('service:theme');
  // window.addEventListener('scroll', function(event) {
  //   const clientRect = event.target.documentElement.getBoundingClientRect();
  //   theme.set('viewportPosition', clientRect);
  // });
  // debugger;
  // appInstance.inject('route', 'foo', 'service:foo');

}

export default {
  initialize
};
