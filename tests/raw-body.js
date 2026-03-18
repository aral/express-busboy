var assert = require('assert'),
    bb = require('../'),
    express = require('express'),
    request = require('request'),
    portfinder = require('portfinder');

var app = express();
bb.extend(app);
var base = 'http://127.0.0.1:';
var setup = function(app, port) {
    app._server = app.listen(port);
    app.all('/', function(req, res) {
        res.send({
            body: req.body,
            files: req.files,
            rawBody: req.rawBody ? req.rawBody.toString() : null,
            contentType: req.headers['content-type']
        });
    });
};

describe('express-busboy: rawBody', function() {
    before(function(done) {
        portfinder.getPort(function(e, p) {
            setup(app, p);
            base += p;
            done();
        });
    });

    after(function() {
        app._server.close();
    });

    it('should populate rawBody for JSON requests', function(done) {
        var postData = JSON.stringify({ foo: 'bar' });
        request(
            {
                method: 'POST',
                url: base + '/',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: postData,
                timeout: 2000 // Set a timeout to catch hanging requests
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.equal(d.rawBody, postData);
                assert.equal(d.body.foo, 'bar');
                done();
            }
        );
    });

    it('should populate rawBody for URL-encoded requests', function(done) {
        var postData = 'foo=bar&baz=qux';
        request(
            {
                method: 'POST',
                url: base + '/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: postData,
                timeout: 2000
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.equal(d.rawBody, postData);
                assert.equal(d.body.foo, 'bar');
                assert.equal(d.body.baz, 'qux');
                done();
            }
        );
    });

    it('should populate rawBody for plain text requests', function(done) {
        var postData = 'just some plain text';
        request(
            {
                method: 'POST',
                url: base + '/',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: postData,
                timeout: 2000
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.equal(d.rawBody, postData);
                done();
            }
        );
    });
    it('should NOT populate rawBody for multipart requests', function(done) {
        request(
            {
                method: 'POST',
                url: base + '/',
                formData: {
                    foo: 'bar'
                },
                timeout: 2000
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.ok(d.contentType.indexOf('multipart/form-data') === 0);
                assert.equal(d.rawBody, null);
                assert.equal(d.body.foo, 'bar');
                done();
            }
        );
    });

    it('should handle requests without busboy (no body)', function(done) {
        request(
            {
                method: 'GET',
                url: base + '/',
                timeout: 2000
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.ok(d.rawBody === null || d.rawBody === '');
                done();
            }
        );
    });

    it('should handle non-JSON/non-busboy requests with body', function(done) {
        var postData = 'some-raw-data';
        request(
            {
                method: 'POST',
                url: base + '/',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: postData,
                timeout: 2000
            },
            function(err, res, d) {
                if (err) return done(err);
                d = JSON.parse(d);
                assert.ok(d);
                assert.equal(d.rawBody, postData);
                done();
            }
        );
    });
});
