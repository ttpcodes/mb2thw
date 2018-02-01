class BaseParser {
  get types() {
    return {
      ARRAY: 'Array',
      BOOLEAN: 'Boolean',
      OBJECT: '',
      STRING: 'String'
    };
  }

  static async prepare(args) {
    let base = new BaseParser();
    base.parsers = [
      {
        name: 'Input',
        class: require('./InputParser')
      }
    ];
    for (let parser in base.parsers) {
      base.parsers[parser].class = await base.parsers[parser].class.prepare(args);
    }
    return base;
  }

  constructor() {}

  async get(type, args) {
    for (let parser of this.parsers) {
      let response = await parser.class['get' + type](args[parser.name]);
      if (response !== undefined) {
        return response;
      }
    }
    return undefined;
  }

  getArray() {
    throw new ReferenceError('This method must be overriden');
  }

  getBoolean() {
    throw new ReferenceError('This method must be overriden');
  }

  getString() {
    throw new ReferenceError('This method must be overriden');
  }
}

module.exports = BaseParser;
