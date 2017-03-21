import * as Promise from 'bluebird';
import * as superagent from 'superagent-bluebird-promise';
import * as url from 'url';

export default class Confluency {
  constructor({host, context='', username, password}) {
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


  auth(request) {    
    if (this.username && this.password) {
      request.set('Authorization', this.getBasicAuth());
    }
    return request;
  }


  GET(uri) {
    let prefix = '/rest/api';
    if (uri.slice(0, prefix.length) === prefix) {
      prefix = '';
    }
    const request = this.client.get(this.compositeUri({prefix, uri}));
    this.auth(request);
    return request.then(data => data.body);
  }

 
  POST(uri, body) {
    const prefix = '/rest/api';
    const request = this.client.post(this.compositeUri({prefix, uri}));
    this.auth(request);
    request.set('Content-Type', 'application/json');
    return request.send(body).then(data => data.body); 
  }
  
  
  PUT(uri, body) {
    const prefix = '/rest/api';
    const request = this.client.put(this.compositeUri({prefix, uri}));
    this.auth(request);
    request.set('Content-Type', 'application/json');
    return request.send(body).then(data => data.body).catch(e => console.error(e));
  }


  DEL(uri) {
    const prefix = '/rest/api';
    const request = this.client.del(this.compositeUri({prefix, uri}));
    this.auth(request);
    return request.then(data => data.body);
  }


  createQueryString(parameters) {
    Object.keys(parameters).forEach((key) => {
      if (Array.isArray(parameters[key])) {
        parameters[key] = parameters[key].join(',');
      }

      if (!parameters[key] && typeof parameters[key] !== "number") {
        delete parameters[key];
      }
    });
    return url.format({
      query: parameters
    });
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-getContent
  getPage(pageId, expand) {
    let uri = '/content/' + pageId;
    uri += this.createQueryString({
      expand: expand
    });
    return Promise.resolve().then(() => this.GET(uri));
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content/{id}/child-childrenOfType
  getChildren(pageId, {all, expand=[]} = {}) {
    let uri = '/content/' + pageId + '/child/page';
    uri += this.createQueryString({
      expand: expand
    });
    return Promise.resolve().then(() => {
      if (!all) return this.GET(uri).then(body => body.results);
      return this._getPagesAll(uri);
    });
  };


  _getPagesAll(query, pages=[]) {
    return this.GET(query).then(body => {
      pages = pages.concat(body.results);
      if (!body._links.next) return pages;
      return this._getPagesAll(body._links.next, pages);
    });
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#space-contentsWithType
  getPages(spaceKey, opts={limit: 25,expand: []}) {
    return Promise.resolve().then(() => {
      const query = '/space/' + spaceKey + '/content/page';
      if (!opts.all) return this.GET(query).then(body => body.results);
      return this._getPagesAll(query + this.createQueryString({
        limit: opts.limit,
        expand: opts.expand
      }));
    });
  }


  _getSpacesAll(query, spaces=[]) {
    return this.GET(query).then(body => {
      spaces = spaces.concat(body.results);
      if (!body._links.next) return spaces;
      return this._getSpacesAll(body._links.next, spaces);
    });
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#space-spaces
  getSpaces(opts={limit:25}) {
    return Promise.resolve().then(() => {
      if (!opts.all) return this.GET('/space').then(body => body.results);
      return this._getSpacesAll('/space' + this.createQueryString({
        limit: opts.limit
      }));
    });
  };


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#d3e915
  getSpace(spaceKey) {
    return Promise.resolve().then(() => this.GET('/space/' + spaceKey));
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-createContent
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


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-update
  update({space, id, title, content, parent, version}) {
    const body = {
      type: 'page',
      title: title,
      space: {key: space},
      version: {
        number: version,
        minorEdit: false
      },
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
    return this.PUT('/content/' + id, body);
  }
  

  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-delete
  del(pageId) {
    return this.DEL('/content/' + pageId);
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content/{id}/label-addLabels
  tagLabel(pageId, label) {
    return this.POST(`/content/${pageId}/label`, [{prefix: 'global', name: label}]);
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content/{id}/label-addLabels
  tagLabels(pageId, labels) {
    labels = labels.map(label => ({prefix: 'global', name: label}));
    return this.POST(`/content/${pageId}/label`, labels);
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content/{id}/label-labels
  getLabels(pageId) {
    return this.GET(`/content/${pageId}/label`).then(body => body.results);
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content/{id}/label-deleteLabelWithQueryParam
  untagLabel(pageId, label) {
    return this.DEL(`/content/${pageId}/label` + this.createQueryString({
      name: label
    }));
  }


  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-search
  search(cql, {limit}={}) {
    const query = {cql, limit};
    return this.GET('/content/search' + url.format({query})).then(body => body.results);
  }
  
  
  // https://docs.atlassian.com/atlassian-confluence/REST/latest/#content-update
  changeParent(pageId, parentId) {
    return this.getPage(pageId).then(page => {
      const body = {
        type: 'page',
        title: page.title,
        version: {number: page.version.number + 1},
        ancestors: [{type: 'page', id: parentId}]
      };
      return this.PUT('/content/' + pageId, body);
    });
  }

  // https://developer.atlassian.com/confdev/confluence-server-rest-api/confluence-rest-api-examples#ConfluenceRESTAPIExamples-Convertwikimarkuptostorageformat
  convertWikiMarkup(content) {
    return this.POST('/contentbody/convert/storage', {
      value: content,
      representation: "wiki"
    }).then((response) => {
      return response.value
    });
  }
}
