var Confluency = require('..').default;
require('should');

// var confluency = new Confluency('http://krconfluence.ea.com:8090', 'kson', '!upfront1oversee');
var confluency = new Confluency('https://confluence.atlassian.com');

// you need to set the config.js correctly to run this test.
describe('default', function () {
  it('should get a page', function (done) {
    confluency.getPage(139456).then(function (data) {
    }).then(done, done);
  });
  it('should get child pages', function (done) {
    confluency.getChildren(251005338).then(function (data) {
    }).then(done, done);
  });
  it('should get spaces', function (done) {
    confluency.getSpaces().then(function (spaces) {
      spaces.should.be.an.Array();
    }).then(done, done);
  });
  it('should get every spaces', function (done) {
    this.timeout(10000);
    confluency.getSpaces({all: true, limit: 500}).then(function (spaces) {
      spaces.should.be.an.Array();
      spaces.length.should.greaterThan(380);
    }).then(done, done);
  });
  it('should get a space', function (done) {
    confluency.getSpace('JIRA').then(function (space) {
      space.should.have.property('key');
      space.key.should.be.exactly('JIRA');
    }).then(done, done);
  });
  it('should get pages in a space', function (done) {
    this.timeout(20000);
    confluency.getPages('JIRA').then(function (pages) {
      pages.should.be.an.Array();
    }).then(done, done);
  });
  it('should get every pages in a space', function (done) {
    this.timeout(20000);
    confluency.getPages('JIRA', {all: true, limit: 500}).then(function (pages) {
      pages.should.be.an.Array();
      pages.length.should.greaterThan(1200);
    }).then(done, done);
  });
});
