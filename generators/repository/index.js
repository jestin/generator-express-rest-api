var yeoman = require('yeoman-generator');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  initializingStep: function() {
    this.questions = [];
    this.repositoryName = 'clown';
    this.repositoryClassName = 'Clown';
    this.repositoryInstanceName = 'clown';
    this.repositoryRequirePathFromTest = '';
  },

  promptingStep: function() {
    this.questions.push({ type    : 'input',
                          name    : 'repositoryName',
                          message : 'Repository Name (dash delimited, leave off -repository)',
                          default : this.repositoryName });

    var done = this.async();

    var generator = this;

    var handleAnswers = function(answers) {
      generator.repositoryName = answers.repositoryName.toLowerCase();
      generator.repositoryClassName = generator._.classify(answers.repositoryName);
      generator.repositoryInstanceName = generator._.camelize(generator.repositoryName);
      generator.repositoryRequirePathFromTest =  '../../../app/repositories/' + generator.repositoryName + '-repository';

      done();
    };

    this.prompt(this.questions, handleAnswers.bind(this));
  },

  configuringStep: function() {
  },

  defaultStep: function() {
  },

  writingStep: function() {
    copyRepository(this);
    copyRepositoryTest(this);
  },

  conflictsStep: function() {
  },

  installStep: function() {
  },

  endStep: function() {
  }
});

function copyRepository(generator) {
  var repositoryDestination = generator.destinationRoot() +
                              '/app/repositories/' +
                              generator.repositoryName.toLowerCase() +
                              '-repository.js';

  copyTemplate(generator, 'app/repositories/_repository.js', repositoryDestination);
}

function copyRepositoryTest(generator) {
  var repositoryTestDestination = generator.destinationRoot() +
                                  '/test/spec/repositories/' +
                                  generator.repositoryName.toLowerCase() +
                                  '-repository.tests.js';

  copyTemplate(generator, 'test/spec/repositories/_repository.tests.js', repositoryTestDestination);
}

function copyTemplate(generator, template, path) {
  if(fs.existsSync(path)) {
    console.log('The file "' + path + '" already exists!');
  }
  else {
    generator.template(template, path);
  }
}
