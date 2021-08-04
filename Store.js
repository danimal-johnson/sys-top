const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');

    this.filePath = path.join(userDataPath, options.configName + '.json');
    this.store = parseDataFile(this.filePath, options.defaults);
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.store));
  }

  get(key) {
    return this.store[key];
  }

  set(key, value) {
    this.store[key] = value;
    this.save();
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return defaults;
  }
}

module.exports = Store;