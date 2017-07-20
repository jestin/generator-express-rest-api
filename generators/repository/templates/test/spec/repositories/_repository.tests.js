
describe('<%= repositoryClassName %>Repository Tests', function() {

	var <%= repositoryInstanceName %>Repository;

	beforeEach(function() {
		<%= repositoryInstanceName %>Repository = require('<%= repositoryRequirePathFromTest %>')({});
	});

	describe('create()', function() {

		it('should be a function', function(done) {
			expect(<%= repositoryInstanceName %>Repository.create).to.be.a('function');
			done();
		});

	});

	describe('retrieve()', function() {

		it('should be a function', function(done) {
			expect(<%= repositoryInstanceName %>Repository.retrieve).to.be.a('function');
			done();
		});

	});

	describe('update()', function() {

		it('should be a function', function(done) {
			expect(<%= repositoryInstanceName %>Repository.update).to.be.a('function');
			done();
		});

	});

	describe('delete()', function() {

		it('should be a function', function(done) {
			expect(<%= repositoryInstanceName %>Repository.delete).to.be.a('function');
			done();
		});

	});
});
