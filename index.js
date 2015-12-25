var Promise = require('bluebird');
var superagent = require('superagent-bluebird-promise');

function GET(uri) {
  var prefix = '/rest/api';
  if (uri.slice(0, prefix.length) === prefix) {
    prefix = '';
  }
  return client.get(host + prefix + uri).then(function (data) {
    return data.body;
  });
}

var client;
var token;
var host;
exports.connect = function connect(host_) {
  client = superagent.agent();
  host = host_;
};

function checkCondition() {
  if (!client) throw new Error('Not Connected');
  // if (!token) return rej(new Error('Not Logged-in'));
}

exports.getPage = function getPage(pageId) {
  return Promise.resolve().then(function () {
    checkCondition();
    return GET('/content/' + pageId);
  });
};

exports.getChildren = function getChildren(pageId) {
  return Promise.resolve().then(function () {
    checkCondition();
    return GET('/content/' + pageId + '/child/page');
  });
};

function _getPagesAll(query, pages) {
  pages = pages || [];
  return GET(query).then(function (body) {
    pages = pages.concat(body.results);
    if (!body._links.next) return pages;
    return _getPagesAll(body._links.next, pages);
  });
}

exports.getPages = function getPages(spaceKey, opts) {
  opts = opts || {};
  opts.limit = opts.limit || 25;
  return Promise.resolve().then(function () {
    checkCondition();
    var query = '/space/' + spaceKey + '/content/page';
    if (!opts.all) return GET(query).then(function (body) { return body.results; });
    return _getPagesAll(query + '?limit=' + opts.limit);
  });
};

function _getSpacesAll(query, spaces) {
  spaces = spaces || [];
  return GET(query).then(function (body) {
    spaces = spaces.concat(body.results);
    if (!body._links.next) return spaces;
    return _getSpacesAll(body._links.next, spaces);
  });
}

exports.getSpaces = function getSpaces(opts) {
  opts = opts || {};
  opts.limit = opts.limit || 25;
  return Promise.resolve().then(function () {
    checkCondition();
    if (!opts.all) return GET('/space').then(function (body) { return body.results; });
    return _getSpacesAll('/space?limit=' + opts.limit);
  });
};

exports.getSpace = function getSpace(spaceKey) {
  return Promise.resolve().then(function () {
    checkCondition();
    return GET('/space/' + spaceKey);
  });
};
