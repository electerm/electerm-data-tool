/**
 * Password encryption/decryption utilities
 * Based on electerm's pass-enc.js
 */

const enc = (str) => {
  if (typeof str !== 'string') {
    return str
  }
  return str.split('').map((s, i) => {
    return String.fromCharCode((s.charCodeAt(0) + i + 1) % 65536)
  }).join('')
}

const dec = (str) => {
  if (typeof str !== 'string') {
    return str
  }
  return str.split('').map((s, i) => {
    return String.fromCharCode((s.charCodeAt(0) - i - 1 + 65536) % 65536)
  }).join('')
}

/**
 * Decrypt password in an object
 * @param {object} obj
 */
function decObj (obj) {
  if (obj.passwordEncrypted && obj.password) {
    obj.password = dec(obj.password)
    delete obj.passwordEncrypted
  }
  return obj
}

/**
 * Encrypt password in an object
 * @param {object} obj
 */
function encObj (obj) {
  if (!obj.passwordEncrypted && obj.password) {
    obj.password = enc(obj.password)
    obj.passwordEncrypted = true
  }
  return obj
}

module.exports = {
  enc,
  dec,
  encObj,
  decObj
}
