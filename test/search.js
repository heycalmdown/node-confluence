
import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('test search', function () {
  this.timeout(10000);

  it('should get a page by title and type', function () {
    return confluency.search('title=confluency AND type=page').then(data => {
      data.should.be.an.Array();
      data.should.be.length(1);
    });
  });
});
