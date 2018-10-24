import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import 'should';
import Confluency from '..';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test pages', function () {
  this.timeout(10000);

  const space = 'CON';
  const parent = '1081356';
  const pageIds: string[] = [];
  before(() => {
    function remember(page) {
      pageIds.push(page.id);
      return page;
    }
    return confluency.create({space, title: 'parent 1', content: 'parent 1', parent}).then(remember).then(page => {
      return confluency.create({space, title: 'child', content: 'child', parent: page.id}).then(remember);
    }).then(() => {
      return confluency.create({space, title: 'parent 2', content: 'parent 2', parent}).then(remember);
    }).catch(e => {
      console.error(e);
      throw e;
    });
  });

  after(() => {
    return Bluebird.each(pageIds, pageId => {
      return confluency.del(pageId);
    });
  });

  it('should move a child', async () => {
    const page = await confluency.changeParent(pageIds[1], pageIds[2]);
    _.takeRight(page.ancestors, 1)[0].title.should.be.exactly('parent 2');
  });
});
