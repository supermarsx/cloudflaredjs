/*
  Cloudflared record control
 */

'use strict';

const querystring = require('querystring'),
  defaults = require('./config').config,
  https = require('./request.js');

/*
  CFcheckToken
    Check Cloudflare tokens validity
  parameters
    tokens (object) - Tokens to validate in an object
      example: {token: 'abcdxxxxxxxx', token: 'abcexxxxxxxx'}
    config (object) - Use a specific configuration object
  returns
    requests (array/object) - Array of request body replies, or object if is only one token
 */
async function CFcheckToken(tokensObject = null, config = defaults) {
  var tokens, requests = [];
  var {
    cloudflare
  } = config;
  var {
    request,
    defaults
  } = cloudflare;

  tokens = Object.values(tokensObject ? tokensObject : {
    token: defaults.token
  });

  for (var token in tokens) {
    var options = {
      hostname: request.hostname,
      path: request.paths.verify,
      method: request.methods.get,
      headers: getHeaders(request),
      insecure: request.insecure,
      rejectUnauthorized: request.rejectUnauthorized
    };

    var result = await https.request(options);

    requests.push(request.convertJSON ? JSON.parse(result.body) : result);
  }

  if (requests.length === 1 && request.ifOneDismantleArray) {
    return requests[0];
  }

  return requests;
}

/*
  CFlistZones
    List Cloudflare Zones, get single zone information
  parameters
    token (string) - Token used for Zone listing, need all zones permission
    domain (string) - Exact domain name to search for
    config (object) - Use a specific configuration object
  returns
    result (object) - Cloudflare zones
 */
async function CFlistZones(token = null, domain = null, config = defaults) {
  var data = {
    name: domain
  };
  var {
    cloudflare
  } = config;
  var {
    request,
    defaults
  } = cloudflare;
  var {
    methods
  } = request;

  var options = {
    hostname: request.hostname,
    path: request.paths.zones + (domain ? '?' + querystring.stringify(data) : ''),
    method: methods.get,
    headers: getHeaders(request)
  };

  var result = await https.request(options);

  return request.convertJSON ? JSON.parse(result.body) : result;
}

/*
  CFgetZoneId
    Get Cloudflare Zone ID
  parameters
    token (string) - Token used to obtain Zone ID
    domain (string) - Exact domain name to look for
 */
async function CFgetZoneId(token = null, domain = null, config = defaults) {
  var zoneList, zoneId;

  zoneList = await CFlistZones(token, domain, config);

  zoneId = zoneList.result[0].id;

  return zoneId;
}

/*
  CFlistDNS
    Get a specific Cloudflare DNS record within a Zone ID
  parameters
    token (string) - Token used to list DNS records within a zone
    type (string) - Record type
    zoneId (string) - Zone ID where to look for DNS records
    recordName (string) - Exact record name within the records list to look for
 */
async function CFlistDNS(token = null, zoneId = null, recordType = 'A', recordName = null, config = defaults) {
  var data = {
    type: recordType,
    name: recordName
  };
  var {
    cloudflare
  } = config;
  var {
    request,
    defaults
  } = cloudflare;
  var {
    methods
  } = request;

  var options = {
    hostname: request.hostname,
    path: request.paths.zones + zoneId + '/dns_records?' + querystring.stringify(data),
    method: methods.get,
    headers: getHeaders(request)
  };

  var result = await https.request(options);

  return (request.convertJSON ? JSON.parse(result.body) : result);
}

/*
  CFgetDNSId
    Get Cloudflare DNS Record ID
  parameters
    token (string) - Token used to list DNS records within a zone
    zoneId (string) - Zone ID where to look for DNS records
    recordName (string) - Exact record name within the records list to look for
 */
async function CFgetDNSId(token = null, zoneId = null, recordName = null, config = defaults) {
  var dnsList, dnsId;

  dnsList = await CFlistDNS(token, zoneId, recordName, config);
  dnsId = dnsList.result[0].id;

  return dnsId;
}

/*
  CFgetDNSIp
    Get current Cloudflare DNS Record IP
  parameters
    token (string) - Token used to list DNS records within a zone
    zoneId (string) - Zone ID where to look for DNS records
    recordName (string) - Exact record name within the records list to look for
 */
async function CFgetDNSIp(token = null, zoneId = null, recordName = null, config = defaults) {
  var dnsList, dnsId;

  dnsList = await CFlistDNS(token, zoneId, recordName, config);
  dnsId = dnsList.result[0].content;

  return dnsId;
}

/*
  CFupdateDNSRecord
    Update Cloudflare DNS Record
  parameters
    token (string) - Token used to update the DNS record
    zoneId (string) - Zone ID where the record is located
    dnsId (string) - DNS record ID to be updated
 */
async function CFupdateDNSRecord(token = null, zoneId = null, dnsId = null, record = {}, config = defaults) {
  var {
    cloudflare
  } = config;
  var {
    defaults,
    request
  } = cloudflare;
  var {
    methods
  } = request;

  if (!record) {
    record = {
      type: defaults.records.type,
      name: defaults.records.name,
      content: defaults.records.content,
      ttl: defaults.records.ttl
    };
  }

  var options = {
    hostname: request.hostname,
    path: request.paths.zones + zoneId + '/dns_records/' + dnsId,
    method: methods.put,
    headers: getHeaders(request)
  };

  var result = await https.request(options, JSON.stringify(record));

  return (request.convertJSON ? JSON.parse(result.body) : result);
}

/*
  getHeaders
 */
function getHeaders(request) {
  return {
    'Authorization': request.authorizationPrefix + (token ? token : defaults.token),
    'Content-Type': request.contentType,
    'Accept': request.accept,
    'Accept-Encoding': request.acceptEncoding,
    'User-Agent': request.userAgent
  };
}

module.exports = {
  checkToken: CFcheckToken,
  listZones: CFlistZones,
  getZoneId: CFgetZoneId,
  listDNS: CFlistDNS,
  getDNSId: CFgetDNSId,
  getDNSIp: CFgetDNSIp,
  updateDNSRecord: CFupdateDNSRecord,
  CFcheckToken,
  CFlistZones,
  CFgetZoneId,
  CFlistDNS,
  CFgetDNSId,
  CFgetDNSIp,
  CFupdateDNSRecord
};
