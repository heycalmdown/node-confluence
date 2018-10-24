import 'should';
import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test a page', function () {
  this.timeout(10000);

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

  it('should tag a label', async () => {
    await confluency.tagLabel(pageId, 'test');
    const labels = await confluency.getLabels(pageId);
    labels.should.be.an.Array();
    labels[0].name.should.be.exactly('test');
  });

  it('should tag labels', async () => {
    await confluency.tagLabels(pageId, ['test1', 'test2']);
    const labels = await confluency.getLabels(pageId);
    labels.should.be.an.Array();
    labels.should.have.length(3);
  });

  it('should untag a label', async () => {
    await confluency.untagLabel(pageId, 'test');
    const labels = await confluency.getLabels(pageId);
    labels.should.be.an.Array();
    labels.should.have.length(2);
  });

  it('updates the text', async () => {
    // Version is 2 because we just created the page during the start of
    // the test.
    await confluency.update({
      title: 'updated page test',
      id: pageId,
      content: 'updated content',
      parent: undefined,
      version: 2
    });
    const page = await confluency.getPage(pageId, ['body.storage']);
    page.title.should.be.exactly('updated page test');
    page.body!.storage!.value.should.be.exactly('updated content');
  });
});
