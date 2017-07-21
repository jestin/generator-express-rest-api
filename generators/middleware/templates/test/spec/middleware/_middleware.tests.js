
describe('<%= middlewareName %> middleware Tests', function() {

	var <%= middlewareName %>;

	beforeEach(function() {
		<%= middlewareName %> = require('<%= middlewareRequirePathFromTest %>')({});
	});

	describe('<%= middlewareName %>', function() {

		it('should be a function', function(done) {
			expect(<%= middlewareName %>).to.be.a('function');
			done();
		});

	});

});
