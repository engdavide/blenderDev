/*
 * base64.js: An extremely simple implementation of base64 encoding / decoding using node.js Buffers
 *
 * (C) 2010, Nodejitsu Inc.
 * (C) 2011, Cull TV, Inc.
 *
 */

function base64encode(unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

function base64decode(encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};

module.exports = {
  base64encode: function(unencoded) {
    return new Buffer(unencoded || '').toString('base64');
  },
  
  base64decode: function(encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
  },
  
  base64urlEncode: function(unencoded) {
    var encoded = base64encode(unencoded);
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  
  base64urlDecode: function(encoded) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (encoded.length % 4)
      encoded += '=';
    return base64decode(encoded);
  }

}