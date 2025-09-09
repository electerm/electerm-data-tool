/**
 * nedb api wrapper
 */

const { defaultUserName, getAppType, getCurrentAppPath } = require('./common/app-props')
const { resolve } = require('path')
const Datastore = require('@yetzt/nedb')
const db = {}

const reso = (name) => {
  const appType = getAppType()
  const currentAppPath = getCurrentAppPath()
  let basePath

  if (appType === 'web') {
    basePath = resolve(currentAppPath, 'nedb-database', 'users', defaultUserName)
  } else {
    basePath = resolve(currentAppPath, 'electerm', 'users', defaultUserName)
  }

  return resolve(basePath, `electerm.${name}.nedb`)
}
const tables = [
  'bookmarks',
  'bookmarkGroups',
  'addressBookmarks',
  'terminalThemes',
  'lastStates',
  'data',
  'quickCommands',
  'log',
  'dbUpgradeLog',
  'profiles'
]

tables.forEach(table => {
  const conf = {
    filename: reso(table),
    autoload: true
  }
  db[table] = new Datastore(conf)
})

const dbAction = (dbName, op, ...args) => {
  if (op === 'compactDatafile') {
    db[dbName].persistence.compactDatafile()
    return
  }
  return new Promise((resolve, reject) => {
    db[dbName][op](...args, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = {
  dbAction,
  tables
}
