const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

function getBaseConfig(env) {
  return yaml.load(fs.readFileSync(path.join(__dirname, `${env}.yaml`), 'utf8'));
}

module.exports = getBaseConfig;
