/* eslint-env node */
module.exports = {
  normalizeEntityName() {},

  afterInstall(options) {
    return this.addPackageToProject('yup');
  }
};
