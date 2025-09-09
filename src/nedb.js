/**
 * nedb api wrapper
 */

const { appPath, defaultUserName, getAppType } = require('./common/app-props')
const { resolve } = require('path')
const Datastore = require('@yetzt/nedb')
const db = {}

const reso = (name) => {
  const appType = getAppType()
  let basePath

  if (appType === 'web') {
    basePath = resolve(appPath, 'nedb-database', 'users', defaultUserName)
  } else {
    basePath = resolve(appPath, 'electerm', 'users', defaultUserName)
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
