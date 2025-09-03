#!/usr/bin/env node

/**
 * Electerm Data Tool - Command Line Interface
 * Provides tools to migrate and export electerm data
 */

const { Command } = require('commander')
const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { migrate } = require('./migrate/migrate-1-to-2')
const log = require('./common/log')
const pkg = require('../package.json')

const program = new Command()

/**
 * Get the major version number from Node.js version string
 * @returns {number} Major version number
 */
function getNodeMajorVersion () {
  const nodeVersion = process.version
  return parseInt(nodeVersion.slice(1).split('.')[0])
}

program
  .name('electerm-data-tool')
  .description('CLI tool for electerm data migration and export')
  .version(pkg.version)

/**
 * Migration command - migrates from NeDB (v1) to SQLite (v2)
 */
program
  .command('migrate')
  .description('Migrate electerm database from v1 (NeDB) to v2 (SQLite)')
  .action(async () => {
    try {
      // Check Node.js version requirement for SQLite
      const majorVersion = getNodeMajorVersion()

      if (majorVersion < 22) {
        console.error('❌ Migration requires Node.js v22.0.0 or higher for SQLite support')
        console.error(`   Current version: ${process.version}`)
        console.error('   Please upgrade Node.js and try again.')
        console.error('   You can still use the export function with your current Node.js version.')
        process.exit(1)
      }

      log.info('Starting migration process...')
      await migrate()
      log.info('Migration completed successfully!')
      console.log('✅ Migration from NeDB to SQLite completed successfully!')
    } catch (error) {
      log.error('Migration failed:', error)
      console.error('❌ Migration failed:', error.message)
      process.exit(1)
    }
  })

/**
 * Export command - exports all electerm data to a JSON file
 */
program
  .command('export')
  .description('Export all electerm data to a JSON file')
  .argument('<output-path>', 'Path to the output JSON file')
  .action(async (outputPath) => {
    try {
      log.info('Starting data export...')

      // Check if migration is needed to determine which database to use
      const { checkMigrate } = require('./migrate/migrate-1-to-2')
      const shouldMigrate = checkMigrate()

      let dbModule
      let dbType

      if (shouldMigrate) {
        // v1 database (NeDB) detected
        dbModule = require('./nedb')
        dbType = 'NeDB (v1)'
        log.info('Detected v1 database, using NeDB for export')
      } else {
        // v2 database (SQLite) or no data
        try {
          dbModule = require('./sqlite')
          dbType = 'SQLite (v2)'
          log.info('Using SQLite database for export')
        } catch (error) {
          log.error('Failed to load SQLite module:', error.message)
          console.error('❌ Failed to load database module')
          process.exit(1)
        }
      }

      const { dbAction, tables } = dbModule
      const exportData = {}

      // Import password decryption utilities
      const { decObj } = require('./common/pass-enc')

      // Helper function to decrypt passwords in data objects
      const decryptPasswords = (data) => {
        if (Array.isArray(data)) {
          return data.map(item => {
            if (item && typeof item === 'object') {
              return decObj({ ...item })
            }
            return item
          })
        }
        return data
      }

      // Export all tables
      for (const table of tables) {
        try {
          log.info(`Exporting table: ${table}`)
          const data = await dbAction(table, 'find', {})

          // Decrypt passwords in the data
          const decryptedData = decryptPasswords(data)

          exportData[table] = decryptedData || []
          log.info(`Exported ${decryptedData?.length || 0} records from ${table}`)
        } catch (error) {
          log.warn(`Failed to export table ${table}:`, error.message)
          exportData[table] = []
        }
      }

      // Also try to export config if it exists in the data table
      try {
        const configData = await dbAction('data', 'findOne', { _id: 'config' })
        if (configData && configData.value) {
          exportData.config = configData.value
          log.info('Exported config data')
        }
      } catch (error) {
        log.warn('Failed to export config data:', error.message)
      }

      console.log(`📊 Database Type: ${dbType}`)

      // Resolve the output path
      const resolvedPath = resolve(process.cwd(), outputPath)

      // Write the JSON file
      const jsonString = JSON.stringify(exportData, null, 2)
      writeFileSync(resolvedPath, jsonString, 'utf8')

      const totalRecords = Object.values(exportData).reduce((sum, table) => {
        return sum + (Array.isArray(table) ? table.length : 0)
      }, 0)

      log.info(`Export completed. ${totalRecords} total records exported to ${resolvedPath}`)
      console.log('✅ Export completed successfully!')
      console.log(`📄 ${totalRecords} total records exported to: ${resolvedPath}`)
    } catch (error) {
      log.error('Export failed:', error)
      console.error('❌ Export failed:', error.message)
      process.exit(1)
    }
  })

/**
 * Info command - displays information about the current electerm data
 */
program
  .command('info')
  .description('Display information about the current electerm data')
  .action(async () => {
    try {
      // Check if migration is needed to determine which database to use
      const { checkMigrate } = require('./migrate/migrate-1-to-2')
      const shouldMigrate = checkMigrate()

      let dbModule
      let dbType

      if (shouldMigrate) {
        // v1 database (NeDB) detected
        dbModule = require('./nedb')
        dbType = 'NeDB (v1) - Migration recommended'

        // Check Node.js version for migration capability
        const majorVersion = getNodeMajorVersion()

        console.log('⚠️  v1 database detected.')
        if (majorVersion >= 22) {
          console.log('   Run \'electerm-data-tool migrate\' to upgrade to v2')
        } else {
          console.log(`   Migration requires Node.js v22.0.0+ (current: ${process.version})`)
          console.log('   Please upgrade Node.js to enable migration to v2')
        }
      } else {
        // v2 database (SQLite) or no data
        try {
          dbModule = require('./sqlite')
          dbType = 'SQLite (v2)'
        } catch (error) {
          console.error('❌ Failed to read database:', error.message)
          process.exit(1)
        }
      }

      const { dbAction, tables } = dbModule
      console.log('📊 Electerm Data Information')
      console.log(`Database Type: ${dbType}`)
      console.log('='.repeat(40))

      let totalRecords = 0
      for (const table of tables) {
        try {
          const data = await dbAction(table, 'find', {})
          const count = data?.length || 0
          totalRecords += count
          console.log(`${table.padEnd(20)}: ${count} records`)
        } catch (error) {
          console.log(`${table.padEnd(20)}: Error reading table`)
        }
      }

      console.log('='.repeat(40))
      console.log(`Total Records: ${totalRecords}`)
    } catch (error) {
      console.error('❌ Failed to read data:', error.message)
      process.exit(1)
    }
  })

// Parse command line arguments
program.parse()
