const chai = require('chai');
const expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../server');
var db = require('../models');

chai.use(chaiHttp);
let request;

describe.skip('GET /api/collections', function () {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function () {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });
  it('should find all collections', function(done) {
    // Add some examples to the db to test with
    db.Collection.bulkCreate([
      { name: 'First Example', description: 'First Description' },
      { name: 'Second Example', description: 'Second Description' }
    ]).then(function() {
      // Request the route that returns all examples
      request.get('/api/collections').end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an('array')
          .that.has.lengthOf(2);

        expect(responseBody[0])
          .to.be.an('object')
          .that.includes({ name: 'First Example', description: 'First Description' });

        expect(responseBody[1])
          .to.be.an('object')
          .that.includes({ name: 'Second Example', description: 'Second Description' });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
