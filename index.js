var xmlrpc = require('xmlrpc');
var util = require('util');
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

exports.login = function login(id, password, callback) {
    if (!client) return callback(new Error('Not Connected'));
    client.methodCall('confluence2.login', [id, password], function (err, newToken) {
        if (err) return callback(err);
        token = newToken;
        return callback();
    });
};

exports.getPage = function getPage(pageId, callback) {
    if (!client) return callback(new Error('Not Connected'));
    if (!token) return callback(new Error('Not Logged-in'));
    client.methodCall('confluence2.getPage', [token, new Long(pageId)], callback);
};

exports.storePage = function storePage(page, callback) {
	if (!client) return callback(new Error('Not Connected'));
	if (!token) return callback(new Error('Not Logged-in'));
	client.methodCall('confluence2.storePage', [token, page], callback);
};

exports.updatePage = function updatePage(page, pageUpdateOptions, callback) {
	if (!client) return callback(new Error('Not Connected'));
	if (!token) return callback(new Error('Not Logged-in'));
	client.methodCall('confluence2.updatePage', [token, page, pageUpdateOptions], callback);
};
