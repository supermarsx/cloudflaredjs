// jshint esversion:8
// jshint node:true


var cf = require('../index'),
  token1 = '8jeoPZFbGeUlu0ewDWoj95i0BAunxutma_YAPp-g',
  token2 = 'OwVkTSYQg_P3bWxmiwbWt-coY7Il6YpHYMufjL5C',
  token3 = 'wwl7QxbYYb5MWkfIT_3WYSogi-jc6PHpuVtmOLYC',
  domain1 = 'example.com',
  domain2 = 'example.com',
  recordType1 = 'A',
  newcontent1 = '1.1.1.1';

/*
  Example ways of using cloudflaredjs
    Test token validity
 */

/*

  // Self executing async function
 (async function() {
   var data = await cf.checkToken();
   console.log(data[0]);
 })();

 // Promise finished then
 cf.checkToken().then(function(data) {
   console.log(JSON.parse(data[0]));
 });

 */


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
