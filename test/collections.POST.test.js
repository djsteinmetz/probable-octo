const chai = require('chai');
const expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../server');
var db = require('../models');

chai.use(chaiHttp);
let request;

describe.skip('POST /api/collections', function () {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function () {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it('should create a new collection', function() {
    const reqBody = {
      name: 'Example Collection1',
      description: 'This is the Collection1'
    };

    request
      .post('/api/collections')
      .send(reqBody)
      .end(function (err, res) {
        let responseStatus = res.status;
        let responseBody = res.body;

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an('object')
          .that.includes(reqBody);

        done();
      });

  });

});