/* eslint-env node */
module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addPackagesToProject(['yup', 'ember-cli-cjs-transform']);
  },

  beforeUninstall() {
    return this.removePackagesFromProject(['yup', 'ember-cli-cjs-transform']);
  }
};
