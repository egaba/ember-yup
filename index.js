'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    console.log('hfsefasefes including ember yup');

    app.import('node_modules/yup/lib/index.js', {
      using: [
        { transformation: 'cjs', as: 'yup' }
      ]
    });
  },
};
