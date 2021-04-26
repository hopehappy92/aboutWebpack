const childProcess = require("child_process");

module.exports = function banner() {
  const commit = childProcess.execSync("git rev-parse --short HEAD");
  const user = childProcess.execSync("git config user.name");
  const date = new Date().toLocaleString();
  const env = process.env.NODE_ENV;

  return (
    `commitVersion: ${commit}` +
    `Build Date: ${date}\n` +
    `Author: ${user}` +
    `env: ${env}`
  );
};
