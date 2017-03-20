# node-confluence [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![Coverage Status][coveralls-image]][coveralls-url]

- https://docs.atlassian.com/atlassian-confluence/REST/latest/
- https://developer.atlassian.com/confdev/confluence-rest-api/confluence-rest-api-examples
- http://stackoverflow.com/questions/29531312/confluence-rest-api-authorization-issue
- http://stackoverflow.com/questions/23523705/how-to-create-new-page-in-confluence-using-their-rest-api

# How to test

```
$ npm test # for module users 
$ npm run babeltest # for developers
```

[npm-url]: https://npmjs.org/package/confluency
[npm-image]: https://badge.fury.io/js/confluency.png

[travis-url]: http://travis-ci.org/heycalmdown/node-confluence
[travis-image]: https://secure.travis-ci.org/heycalmdown/node-confluence.png?branch=master

[depstat-url]: https://david-dm.org/heycalmdown/node-confluence
[depstat-image]: https://david-dm.org/heycalmdown/node-confluence.png

[coveralls-url]: https://coveralls.io/github/heycalmdown/node-confluence?branch=master
[coveralls-image]: https://coveralls.io/repos/github/heycalmdown/node-confluence/badge.svg?branch=master

# How to use

```Javascript
const host = 'https://xxx.atlassian.net';
const context = process.env.CONFLUENCE_CONTEXT || '';
const confluency = new Confluency({ host, context });
confluency.getPage(1081354).then(data => {
  console.log(data);
});
```

# Support features

- `getPage(pageId, expand)`
- `getChildren(pageId, {all, expand=[]} = {})`
- `getPages(spaceKey, opts={limit: 25})`
- `getSpaces(opts={limit:25})`
- `getSpace(spaceKey)`
- `create({space, title, content, parent})`
- `update({space, id, title, content, parent, version})`
- `del(pageId)`
- `tagLabel(pageId, label)`
- `tagLabels(pageId, labels)`
- `getLabels(pageId)`
- `untagLabel(pageId, label)`
- `search(cql, {limit}={})`
- `changeParent(pageId, parentId)`
