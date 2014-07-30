var xmlrpc = require('xmlrpc');
var util = require('util');
var config = require('./config');

function printError(err) {
    console.error(err);
}

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

if (!module.parent) {
    (function () {
        exports.connect(config.host, config.port, '/rpc/xmlrpc');
        exports.login(config.id, config.password, function (err, token) {
            if (err) return printError(err);

            exports.getPage(17834347, function (err, page) {
                if (err) return printError(err);
                console.info(page.title);
            });
        });
    })();
}
