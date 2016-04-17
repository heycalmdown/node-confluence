import Confluency from '..';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('pages test', function () {
  this.timeout(10000);

  const space = 'CON';
  const parent = '1081356';
  let pageIds = [];
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
    return Promise.each(pageIds, pageId => {
      return confluency.del(pageId);
    });
  });


  it('should move a child', function () {
    return confluency.changeParent(pageIds[1], pageIds[2]).then(page => {
      _.takeRight(page.ancestors, 1)[0].title.should.be.exactly('parent 2');
    });
  });
});
