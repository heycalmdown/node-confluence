import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test simple write', function () {
  this.timeout(10000);

  it('should create a page', function () {
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
