# CloudflaredJS

Manage Cloudflare DNS records using this javascript module, list and update DNS records.

## Quick Start

Clone this repository and require it or just npm install as it is below. Refer to examples for more input.

```
npm i cloudflaredjs
```

## Usage

You can get and update an IP from a certain DNS record using Cloudflare API v4 using a token. Easiest way of how to use is inside `examples/examples.js`, use that as a guide to what you want to attain.

Use cases can include a dynamic IP update using a event/routine that updates Cloudflare DNS records with the new IP as it changes.

## Examples

From `examples.js`:

```javascript

var cf = require('cloudflaredjs'),
  token1 = '8jeoPZFbGeUlu0ewDWoj95i0BAunxutma_YAPp-g',
  token2 = 'OwVkTSYQg_P3bWxmiwbWt-coY7Il6YpHYMufjL5C',
  token3 = 'wwl7QxbYYb5MWkfIT_3WYSogi-jc6PHpuVtmOLYC',
  domain1 = 'example.com',
  domain2 = 'example.com',
  recordType1 = 'A',
  newcontent1 = '1.1.1.1';

/*
  Get Cloudflare v4 API Token validity
 */

(async function() {
  var data = await cf.checkToken({
    token: token1
  });
  console.log('** Get token validity');
  console.log(data.success);
})();

/*
  List DNS Zones
 */

(async function() {
  var data = await cf.listZones(token1);
  console.log('** List DNS Zones');
  console.log(data.success);
})();

/*
  Get DNS Zone ID
 */

(async function() {
  var data = await cf.getZoneId(token1, domain1);
  console.log('** Get DNS Zone ID');
  console.log(data);
})();

/*
  Get DNS Records within a Zone
 */

(async function() {
  var zoneId = await cf.getZoneId(token1, domain1), // Get Zone ID first
    data = await cf.listDNS(token2, zoneId, recordType1, domain1);
  console.log('** Get DNS Records within a zone');
  console.log(data.success);
})();

/*
  Get DNS Record ID within a Zone
 */

(async function() {
  var zoneId = await cf.getZoneId(token1, domain1), // Get Zone ID first
    data = await cf.getDNSId(token2, zoneId, recordType1, domain1);
  console.log('** Get DNS Zone Record ID');
  console.log(data);
})();

/*
  Get DNS Record IP
 */

(async function() {
  var zoneId = await cf.getZoneId(token1, domain1), // Get Zone ID first
    data = await cf.getDNSIp(token2, zoneId, recordType1, domain1);
  console.log('** Get DNS Zone Record IP');
  console.log(data);
})();

/*
  Update DNS record IP
 */

 (async function() {
   var zoneId = await cf.getZoneId(token1, domain1), // Get Zone ID first
    dnsId = await cf.getDNSId(token2, zoneId, recordType1, domain1); // Get DNS ID second
     data = await cf.updateDNSRecord(token2, zoneId, dnsId, {
       type: 'A',
       name: domain2,
       content: newcontent1,
     });
   console.log('** Update DNS Zone Record IP');
   console.log(data.success);
 })();

```

## License

Distributed under MIT License. See `license.md` for more information.
