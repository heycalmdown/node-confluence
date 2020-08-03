import 'should';
import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test simple write', function () {
  this.timeout(10000);

  it('should create a page', async () => {
    const space = 'CON';
    const title = 'example';
    const content = 'haha';
    const page = await confluency.create({space, title, content});
    page.should.have.property('id');
    page.title.should.be.exactly('example');
    page.space!.key.should.be.exactly('CON');
    await confluency.del(page.id);
    confluency.getPage(page.id).should.be.rejectedWith(/Not Found/);
  });

  it('should create a child page', async () => {
    const space = 'CON';
    const title = 'example2';
    const content = 'haha';
    const parent = '1081356';
    const page = await confluency.create({space, title, content, parent});
    page.should.have.property('id');
    page.title.should.be.exactly(title);
    page.space!.key.should.be.exactly(space);
    page.ancestors![2].should.have.property('id', parent);
    await confluency.del(page.id);
    confluency.getPage(page.id).should.be.rejectedWith(/Not Found/);
  });
});
