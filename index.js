'use strict';

const fs = require('fs');
const parseJsDocs = require('./parse-comments.js');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    // if (app.name === 'dummy' && app.env === 'development') {
    //   fs.writeFileSync('./tests/dummy/public/components-api.json', parseJsDocs());
    // }

    app.import('node_modules/yup/lib/index.js', {
      using: [
        { transformation: 'cjs', as: 'yup' }
      ]
    });
  },
};
