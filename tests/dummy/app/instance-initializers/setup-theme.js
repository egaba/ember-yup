

export function initialize(appInstance) {
  const theme = appInstance.lookup('service:theme');
  // window.addEventListener('scroll', function(event) {
  //   const clientRect = event.target.documentElement.getBoundingClientRect();
  //   console.log('scroll', clientRect);
  //
  //   theme.set('viewportWidth', clientRect.width);
  // });

  window.addEventListener('resize', function() {
    theme.set('viewportWidth', window.innerWidth);
  });


}

export default {
  initialize
};
