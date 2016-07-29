import Confluency from '..';
import 'should';

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


  it('should tag labels', function () {
    return confluency.tagLabels(pageId, ['test1', 'test2'])
      .then(() => {
        return confluency.getLabels(pageId);
      })
      .then(labels => {
        labels.should.be.an.Array();
        labels.should.have.length(3);
      });
  });


  it('should untag a label', function () {
    return confluency.untagLabel(pageId, 'test')
      .then(() => {
        return confluency.getLabels(pageId);
      })
      .then(labels => {
        labels.should.be.an.Array();
        labels.should.have.length(2);
      });
  });
});
