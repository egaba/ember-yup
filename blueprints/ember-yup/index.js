/* eslint-env node */
module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addPackagesToProject([
      { name: 'yup' },
      { name: 'ember-cli-cjs-transform' },
    ]);
  },

  beforeUninstall() {
    return this.removePackagesFromProject([
      { name: 'yup' },
      { name: 'ember-cli-cjs-transform' },
    ]);
  }
};
