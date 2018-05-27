const inquirer = require('inquirer');

const BaseParser = require('./BaseParser');

class InputParser extends BaseParser {
  static async prepare() {
    return new InputParser();
  }

  constructor() {
    super();
  }

  async __prompt(question) {
    question.name = 'answer';
    let responses = await inquirer.prompt([question]);
    return responses.answer;
  }

  async get(callback) {
    return await callback();
  }

  async getArray(args) {
    let responses = await this.__prompt({
      type: 'input',
      message: args.message || args
    });
    return responses.split(',');
  }

  async getBoolean(args) {
    return await this.__prompt({
      type: 'confirm',
      message: args.message || args
    });
  }

  /**
   * @returns {String} The string fetched by Inquirer.
   */
  async getString(args) {
    let question = {
      type: 'input',
      message: args.message || args
    }
    if (args.text) {
      question.type = 'editor'
    }
    if (args.choices) {
      question.type = 'list';
      question.choices = args.choices;
    }
    return await this.__prompt(question);
  }
}

module.exports = InputParser;
