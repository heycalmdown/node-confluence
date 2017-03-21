
import Confluency from '..';
import 'should';

const host = process.env.CONFLUENCE_HOST || 'https://confluency.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || 'wiki';
const confluency = new Confluency({ host, context });

describe('convert', function () {
  this.timeout(10000);

  it('changes wiki markup to HTML', function () {
    return confluency.convertWikiMarkup('h1. Heading\n\n**words**').then(data => {
      data.should.be.a.String();
      data.should.be.exactly("<h1>Heading</h1>\n\n<p>*<strong>words</strong>*</p>");
    });
  });
});
