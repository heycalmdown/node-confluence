var Promise = require('bluebird');
var superagent = require('superagent-bluebird-promise');

export default class Confluency {
  constructor(host, username, password) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.client = superagent.agent();
  }


  getBasicAuth() {
    let tok = this.username + ':' + this.password;
    let hash =  new Buffer(tok, 'binary').toString('base64');
    return 'Basic ' + hash;
  }


  GET(uri) {
    var prefix = '/rest/api';
    if (uri.slice(0, prefix.length) === prefix) {
      prefix = '';
    }
    let request = this.client.get(this.host + prefix + uri);
    if (this.username && this.password) {
      request.set('Authorization', this.getBasicAuth());
    }
    return request.then(data => data.body);
  }


  getPage(pageId) {
    return Promise.resolve().then(() => this.GET('/content/' + pageId));
  }


  getChildren(pageId) {
    return Promise.resolve().then(() => this.GET('/content/' + pageId + '/child/page'));
  };


  _getPagesAll(query, pages) {
    pages = pages || [];
    return this.GET(query).then(body => {
      pages = pages.concat(body.results);
      if (!body._links.next) return pages;
      return this._getPagesAll(body._links.next, pages);
    });
  }


  getPages(spaceKey, opts) {
    opts = opts || {};
    opts.limit = opts.limit || 25;
    return Promise.resolve().then(() => {
      var query = '/space/' + spaceKey + '/content/page';
      if (!opts.all) return this.GET(query).then(body => body.results);
      return this._getPagesAll(query + '?limit=' + opts.limit);
    });
  }


  _getSpacesAll(query, spaces) {
    spaces = spaces || [];
    return this.GET(query).then(body => {
      spaces = spaces.concat(body.results);
      if (!body._links.next) return spaces;
      return this._getSpacesAll(body._links.next, spaces);
    });
  }


  getSpaces(opts) {
    opts = opts || {};
    opts.limit = opts.limit || 25;
    return Promise.resolve().then(() => {
      if (!opts.all) return this.GET('/space').then(body => body.results);
      return this._getSpacesAll('/space?limit=' + opts.limit);
    });
  };


  getSpace(spaceKey) {
    return Promise.resolve().then(() => this.GET('/space/' + spaceKey));
  }

}
