import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

xdescribe('default', function () {
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

describe('simple write test', function () {
  it('should create a page', function (done) {
    this.timeout(10000);
    const space = 'CON';
    const title = 'example';
    const content = 'haha';
    confluency.create({space, title, content}).then(page => {
      page.should.have.property('id');
      page.title.should.be.exactly('example');
      page.space.key.should.be.exactly('CON');
      return page.id;
    }).then(pageId => {
      return confluency.del(pageId).then(() => pageId);
    }).then(pageId => {
      confluency.getPage(pageId).should.be.rejectedWith(/404/);
    }).then(done, (e) => {
      console.log(e);
      done(e);
    });
  });

  it('should create a child page', function (done) {
    this.timeout(10000);
    const space = 'CON';
    const title = 'example2';
    const content = 'haha';
    const parent = '1081356';
    confluency.create({space, title, content, parent}).then(page => {
      page.should.have.property('id');
      page.title.should.be.exactly(title);
      page.space.key.should.be.exactly(space);
      page.ancestors[2].should.have.property('id', parent);
      return page.id;
    }).then(pageId => {
      return confluency.del(pageId).then(() => pageId);
    }).then(pageId => {
      confluency.getPage(pageId).should.be.rejectedWith(/404/);
    }).then(done, done);
  });
});
