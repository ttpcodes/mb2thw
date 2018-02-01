const inquirer = require('inquirer');

const BaseParser = require('./BaseParser');

class InputParser extends BaseParser {
  static async prepare() {
    return new InputParser();
  }

  constructor() {
    super();
  }

  static async __prompt(question) {
    question.name = 'answer';
    let responses = await inquirer.prompt([question]);
    return responses.answer;
  }

  static async get(args) {
    return await InputParser.__prompt(args.input);
  }

  static async getArray(args) {
    let responses = await InputParser.__prompt({
      type: 'input',
      message: args.message || args
    });
    return responses.split(',');
  }

  static async getBoolean(args) {
    return await InputParser.__prompt({
      type: 'confirm',
      message: args.message || args
    });
  }

  /**
   * @returns {String} The string fetched by Inquirer.
   */
  static async getString(args) {
    let question = {
      type: 'input',
      message: args.message || args
    }
    if (args.choices) {
      question.type = 'list';
      question.choices = args.choices;
    }
    return await InputParser.__prompt(question);
  }
}

module.exports = InputParser;
