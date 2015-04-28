var xmlrpc = require('xmlrpc');
var util = require('util');
var bluebird = require('bluebird');
var config = require('./config');

function Long(raw) {
  xmlrpc.CustomType.call(this, raw);
};

util.inherits(Long, xmlrpc.CustomType);

Long.prototype.tagName = 'Long';

var client;
var token;
exports.connect = function connect(host, port, path) {
    client = xmlrpc.createClient({ host: host, port: port, path: path });
};

function makeResolve(callback, resolve) {
    if (!callback) return resolve;
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return callback.apply(null, [null].concat(args));
    };
}

function makeReject(callback, reject) {
    return callback || reject;
}

exports.login = function login(id, password, callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        client.methodCall('confluence2.login', [id, password], function (err, newToken) {
            if (err) return rej(err);
            token = newToken;
            return res();
        });
    });
};

exports.getPage = function getPage(pageId, callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        if (!token) return rej(new Error('Not Logged-in'));
        client.methodCall('confluence2.getPage', [token, new Long(pageId)], function (err, page) {
            return res(page);
        });
    });
};

exports.getPages = function getPages(spaceKey, callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        if (!token) return rej(new Error('Not Logged-in'));
        client.methodCall('confluence2.getPages', [token, spaceKey], function (err, pages) {
            if (err) return rej(err);
            return res(pages);
        });
    });
};

exports.getSpaces = function getSpaces(callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        if (!token) return rej(new Error('Not Logged-in'));
        client.methodCall('confluence2.getSpaces', [token], function (err, spaces) {
            if (err) return rej(err);
            return res(spaces);
        });
    });
};

exports.getSpace = function getSpace(spaceKey, callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        if (!token) return rej(new Error('Not Logged-in'));
        client.methodCall('confluence2.getSpace', [token, spaceKey], function (err, space) {
            if (err) return rej(err);
            return res(space);
        });
    });
};

exports.getSpaceStatus = function getSpaceStatus(spaceKey, callback) {
    return new bluebird(function (res, rej) {
        res = makeResolve(callback, res);
        rej = makeReject(callback, rej);
        if (!client) return rej(new Error('Not Connected'));
        if (!token) return rej(new Error('Not Logged-in'));
        client.methodCall('confluence2.getSpaceStatus', [token, spaceKey], function (err, spaceStatus) {
            if (err) return rej(err);
            return res(spaceStatus);
        });
    });
};

// vim: set sts=4 sw=4 ts=8 et:

