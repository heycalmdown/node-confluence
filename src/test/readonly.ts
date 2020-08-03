import 'should';
import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test readonly actions', function ()  {
  this.timeout(10000);

  const READ_TEST = '1164247248'; // https://confluency.atlassian.net/wiki/spaces/CON/pages/1164247248/Read+test

  it('should get a page', async () => {
    await confluency.getPage(READ_TEST);
  });

  it('should get child pages', async () => {
    const data = await confluency.getChildren('1081358');
    data.should.be.an.Array();
    data.length.should.greaterThan(5);
  });

  it('should get spaces', async () => {
    const spaces = await confluency.getSpaces();
    spaces.should.be.an.Array();
    spaces.length.should.equal(2);
  });

  it('should get every spaces', async () => {
    const spaces = await confluency.getSpaces({ all: true, limit: 5 });
    spaces.should.be.an.Array();
    spaces.length.should.equal(2);
  });

  it('should get a space', async () => {
    const space = await confluency.getSpace('CON');
    space.should.have.property('key');
    space.key.should.be.exactly('CON');
  });

  it('should get pages in a space', async () => {
    const pages = await confluency.getPages('CON');
    pages.should.be.an.Array();
  });

  it('should get every pages in a space', async () => {
    const pages = await confluency.getPages('CON', { all: true, limit: 5 });
    pages.should.be.an.Array();
    pages.length.should.greaterThan(10);
  });
});
