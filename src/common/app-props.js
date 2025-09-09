const path = require('path')
const os = require('os')
const version = '1.101.16'

function getAppPath () {
  const home = os.homedir()
  const platform = process.platform
  if (platform === 'darwin') {
    // macOS
    return path.join(home, 'Library', 'Application Support')
  } else if (platform === 'win32') {
    // Windows
    return process.env.APPDATA || path.join(home, 'AppData', 'Roaming')
  } else {
    // Linux and others
    return path.join(home, '.config')
  }
}

function getElectermDataPath () {
  // Priority order:
  // 1. ELECTERM_DATA_PATH (set by --data-path option)
  // 2. APP_PATH (legacy environment variable)
  // 3. Default platform-specific path
  if (process.env.ELECTERM_DATA_PATH) {
    return process.env.ELECTERM_DATA_PATH
  }
  return process.env.APP_PATH || getAppPath()
}

// Global appType variable to store the application type
let globalAppType = 'desktop'

function setAppType (appType) {
  globalAppType = appType || 'desktop'
}

function getAppType () {
  return globalAppType
}

// Use a getter to ensure we always get the current path
Object.defineProperty(exports, 'appPath', {
  get: getElectermDataPath
})

exports.defaultUserName = 'default_user'
exports.setAppType = setAppType
exports.getAppType = getAppType
exports.packInfo = {
  version
}
