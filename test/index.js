var confluency = require('..');

// you need to set the config.js correctly to run this test.
describe('default', function () {
  it('should get the page', function (done) {
    confluency.connect('https://confluence.atlassian.com', 80);
    confluency.getPage()
  })
})
