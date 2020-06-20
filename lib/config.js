// jshint esversion:8
// node:true

var config = {
  cloudflare: {
    request: {
      hostname: 'api.cloudflare.com',
      port: 443,
      authorizationPrefix: 'Bearer ',
      userAgent: 'cloudflaredjs',
      acceptEncoding: '*;q=0',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      contentType: 'application/json',
      insecure: false,
      rejectUnauthorized: true,
      methods: {
        get: 'GET',
        put: 'PUT'
      },
      paths: {
        verify: '/client/v4/user/tokens/verify',
        zones: '/client/v4/zones/'
      },
      convertJSON: true,
      ifOneDismantleArray: true
    },
    defaults: {
      token: '6U_DW7Xn8RMPaYo4PVhgp-68ewPkWSyCc5TayCCe',
      records: {
        type: 'A',
        name: null,
        content: '1.1.1.1',
        ttl: 1
      }
    }

  }
};

exports.config = config;
