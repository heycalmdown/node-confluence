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

describe('simple write test', function () {
  it('should create a page', function () {
    this.timeout(10000);
    const space = 'CON';
    const title = 'example';
    const content = 'haha';
    return confluency.create({space, title, content}).then(page => {
      page.should.have.property('id');
      page.title.should.be.exactly('example');
      page.space.key.should.be.exactly('CON');
      return page.id;
    }).then(pageId => {
      return confluency.del(pageId).then(() => pageId);
    }).then(pageId => {
      confluency.getPage(pageId).should.be.rejectedWith(/404/);
    });
  });

  it('should create a child page', function () {
    this.timeout(10000);
    const space = 'CON';
    const title = 'example2';
    const content = 'haha';
    const parent = '1081356';
    return confluency.create({space, title, content, parent}).then(page => {
      page.should.have.property('id');
      page.title.should.be.exactly(title);
      page.space.key.should.be.exactly(space);
      page.ancestors[2].should.have.property('id', parent);
      return page.id;
    }).then(pageId => {
      return confluency.del(pageId).then(() => pageId);
    }).then(pageId => {
      confluency.getPage(pageId).should.be.rejectedWith(/404/);
    });
  });
});

describe('page test', function () {
  const space = 'CON';
  const title = 'page test';
  const content = 'hoho';
  const parent = '1081356';
  let pageId;
  before(() => {
    return confluency.create({space, title, content, parent}).then(page => {
      pageId = page.id;
    });
  });


  after(() => {
    return confluency.del(pageId);
  });


  it('should tag a label', function () {
    return confluency.tagLabel(pageId, 'test')
      .then(() => {
        return confluency.getLabels(pageId);
      })
      .then(labels => {
        labels.should.be.an.Array();
        labels[0].name.should.be.exactly('test');
      });
  });
});
