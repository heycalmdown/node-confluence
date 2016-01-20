import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

// you need to set the config.js correctly to run this test.
describe('default', function () {
  it('should get a page', function (done) {
    confluency.getPage(1081354).then(data => {
    }).then(done, done);
  });
  it('should get child pages', function (done) {
    confluency.getChildren(1081358).then(data => {
      data.should.be.an.Array();
      data.length.should.greaterThan(5);
    }).then(done, done);
  });
  it('should get spaces', function (done) {
    confluency.getSpaces().then(spaces => {
      spaces.should.be.an.Array();
      spaces.length.should.equal(1);
    }).then(done, done);
  });
  it('should get every spaces', function (done) {
    confluency.getSpaces({all: true, limit: 5}).then(spaces => {
      spaces.should.be.an.Array();
      spaces.length.should.equal(1);
    }).then(done, done);
  });
  it('should get a space', function (done) {
    confluency.getSpace('CON').then(space => {
      space.should.have.property('key');
      space.key.should.be.exactly('CON');
    }).then(done, done);
  });
  it('should get pages in a space', function (done) {
    confluency.getPages('CON').then(pages => {
      pages.should.be.an.Array();
    }).then(done, done);
  });
  it('should get every pages in a space', function (done) {
    this.timeout(10000);
    confluency.getPages('CON', {all: true, limit: 5}).then(pages => {
      pages.should.be.an.Array();
      pages.length.should.greaterThan(10);
    }).then(done, done);
  });
});
