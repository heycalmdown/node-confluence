import * as Promise from 'bluebird';
import * as superagent from 'superagent-bluebird-promise';
import * as url from 'url';

export default class Confluency {
  constructor({host, context, username, password}) {
    this.host = host;
    if (context.length && context[0] !== '/') context = '/' + context;
    this.context = context;
    this.username = username;
    this.password = password;
    this.client = superagent.agent();
  }


  getBasicAuth() {
    const tok = this.username + ':' + this.password;
    const hash =  new Buffer(tok, 'binary').toString('base64');
    return 'Basic ' + hash;
  }
  
  
  compositeUri({prefix, uri}) {
    return this.host + this.context + prefix + uri;
  }


  GET(uri) {
    let prefix = '/rest/api';
    if (uri.slice(0, prefix.length) === prefix) {
      prefix = '';
    }
    const request = this.client.get(this.compositeUri({prefix, uri}));
    if (this.username && this.password) {
      request.set('Authorization', this.getBasicAuth());
    }
    return request.then(data => data.body);
  }

 
  POST(uri, body) {
    const prefix = '/rest/api';
    const request = this.client.post(this.compositeUri({prefix, uri}));
    if (this.username && this.password) {
      request.set('Authorization', this.getBasicAuth());
    }
    request.set('Content-Type', 'application/json');
    return request.send(body).then(data => data.body); 
  }
  
  
  DEL(uri) {
    const prefix = '/rest/api';
    const request = this.client.del(this.compositeUri({prefix, uri}));
    if (this.username && this.password) {
      request.set('Authorization', this.getBasicAuth());
    }
    return request.then(data => data.body);
  }


  getPage(pageId) {
    return Promise.resolve().then(() => this.GET('/content/' + pageId));
  }


  getChildren(pageId) {
    return Promise.resolve().then(() => this.GET('/content/' + pageId + '/child/page')).then(body => body.results);
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
      const query = '/space/' + spaceKey + '/content/page';
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


  create({space, title, content, parent}) {
    const body = {
      type: 'page',
      title: title,
      space: {key: space},
      body: {
        storage: {
          value: content,
          representation: 'storage'
        }
      }
    };
    if (parent) {
      body.ancestors = [{id: parent}];
    }
    return this.POST('/content', body);
  }
  

  del(pageId) {
    return this.DEL('/content/' + pageId);
  }
}
