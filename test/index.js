import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('default', function () {
  it('should get a page', function () {
    return confluency.getPage(1081354).then(data => {
    });
  });
  it('should get child pages', function () {
    return confluency.getChildren(1081358).then(data => {
      data.should.be.an.Array();
      data.length.should.greaterThan(5);
    });
  });
  it('should get spaces', function () {
    return confluency.getSpaces().then(spaces => {
      spaces.should.be.an.Array();
      spaces.length.should.equal(2);
    });
  });
  it('should get every spaces', function () {
    return confluency.getSpaces({all: true, limit: 5}).then(spaces => {
      spaces.should.be.an.Array();
      spaces.length.should.equal(2);
    });
  });
  it('should get a space', function () {
    return confluency.getSpace('CON').then(space => {
      space.should.have.property('key');
      space.key.should.be.exactly('CON');
    });
  });
  it('should get pages in a space', function () {
    return confluency.getPages('CON').then(pages => {
      pages.should.be.an.Array();
    });
  });
  it('should get every pages in a space', function () {
    this.timeout(10000);
    return confluency.getPages('CON', {all: true, limit: 5}).then(pages => {
      pages.should.be.an.Array();
      pages.length.should.greaterThan(10);
    });
  });
});
