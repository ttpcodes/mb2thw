const BaseParser = require('./BaseParser');

class JsonParser extends BaseParser {
  static async prepare(args) {
    if (!args.json) {
      return new JsonParser({});
    }
    let data = require(require('path').resolve(args.json));
    return new JsonParser(data);
  }

  constructor(data) {
    super();
    this.data = data;
  }

  async __loadKey(key) {
    if (!key) {
      return undefined;
    }
    return key.split('/./').reduce(function(prev, curr) {
      return prev ? prev[curr] : undefined;
    }, this.data);
  }

  async get(key) {
    return await this.__loadKey(key);
  }

  async getArray(key) {
    let response = await this.__loadKey(key);
    return (Array.isArray(response) ? response : undefined)
  }

  async getBoolean(key) {
    let response = await this.__loadKey(key);
    return (response === undefined ? undefined : Boolean(response));
  }

  async getString(key) {
    let response = await this.__loadKey(key);
    return (typeof response === 'string' || typeof response === 'number' ? response : undefined);
  }
}

module.exports = JsonParser;
