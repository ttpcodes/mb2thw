const inquirer = require('inquirer');

class Input {
  static async get(question) {
    question.name = 'answer';
    let responses = await inquirer.prompt([question]);
    return responses.answer;
  }

  static async getString(question) {
    let responses = await inquirer.prompt([{
      type: 'input',
      name: 'answer',
      message: question
    }]);
    return responses.answer;
  }

  static async getBoolean(question) {
    let responses = await inquirer.prompt([{
      type: 'confirm',
      name: 'answer',
      message: question
    }]);
    return responses.answer;
  }
}

module.exports = Input;
