import 'should';
import Confluency from '..';
import { cleaning } from './helper';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test a page', function () {
  this.timeout(10000);

  const SEED = Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
  const space = 'CON';
  const title = `${SEED} page test`;
  const content = 'hoho';
  const parent = '1164247255'; // https://confluency.atlassian.net/wiki/spaces/CON/pages/1164247255/Write+test
  let pageId: string;
  before(async () => {
    const page = await confluency.create({ space, title, content, parent });
    pageId = page.id;
  });

  after(() => {
    cleaning(SEED);
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
      title: `${SEED} updated page test`,
      id: pageId,
      content: 'updated content',
      parent: undefined,
      version: 2
    });
    const page = await confluency.getPage(pageId, ['body.storage']);

    page.title.should.be.exactly(`${SEED} updated page test`);
    page.body!.storage!.value.should.be.exactly('updated content');
  });
});
