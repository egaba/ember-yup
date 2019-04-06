/* eslint-env node */
module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addPackageToProject('yup');
  },

  beforeUninstall() {
    return this.removePackageFromProject('yup');
  }
};
