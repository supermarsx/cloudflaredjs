// jshint esversion:8
// jshint node:true

'use strict';

const https = require('https');
const http = require('http');

/*
  request
    Do a HTTP/HTTPS request
  parameters
    options (object) - HTTP/HTTPS request options
    postData (object) - POST data object
 */
function request(options, postData) {
  return new Promise(function(resolve, reject) {
    var httpx = options.insecure ? http : https;

    var req = httpx.request(options, function(res) {
      /*
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      */

      res.body = '';

      res.on('data', function(chunk) {
        res.body += (chunk);
      });

      res.on('end', function() {
        resolve(res);
      });
    });

    req.on('error', function(err) {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();

  });
}

exports.request = request;
