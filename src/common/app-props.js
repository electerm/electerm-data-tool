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

exports.appPath = process.env.APP_PATH || getAppPath()
exports.defaultUserName = 'default_user'
exports.packInfo = {
  version
}
