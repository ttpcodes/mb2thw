const parsers = [
  {
    name: 'Input',
    parser: require('./InputParser')
  }
];

class BaseParser {
  static get types() {
    return {
      ARRAY: 'Array',
      BOOLEAN: 'Boolean',
      STRING: 'String'
    };
  }

  static async get(type, args) {
    for (let parser of parsers) {
      let response = await parser.parser['get' + type](args[parser.name]);
      if (response !== undefined) {
        return response;
      }
    }
    return undefined;
  }

  static getArray() {
    throw new ReferenceError('This method must be overriden');
  }

  static getGeneric() {
    throw new ReferenceError('This method must be overriden');
  }

  static getBoolean() {
    throw new ReferenceError('This method must be overriden');
  }

  static getString() {
    throw new ReferenceError('This method must be overriden');
  }
}

module.exports = BaseParser;
