#!/usr/bin/env node

/**
 * Script to update version in src/common/app-props.js from latest Electerm release
 */

const fs = require('fs')
const path = require('path')
const fetchReleaseInfo = require('./fetch-release-info')

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..')
const appPropsPath = path.join(projectRoot, 'src', 'common', 'app-props.js')
const packageJsonPath = path.join(projectRoot, 'package.json')

async function updateVersion () {
  try {
    console.log('🔍 Fetching latest Electerm release info...')

    // Fetch latest release info from GitHub directly
    const releaseData = await fetchReleaseInfo()
    const version = releaseData.release.tag_name

    if (!version) {
      console.error('❌ No version found in release data')
      process.exit(1)
    }

    // Remove 'v' prefix if present (e.g., 'v1.0.0' -> '1.0.0')
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version

    console.log(`📦 Found latest Electerm version: ${cleanVersion}`)

    // Read current app-props.js
    const appPropsContent = fs.readFileSync(appPropsPath, 'utf8')

    // Replace the version line using regex
    const versionRegex = /const version = '[^']*'/

    if (!versionRegex.test(appPropsContent)) {
      console.error('❌ Could not find version declaration in app-props.js')
      console.error('Expected format: const version = \'1.0.0\'')
      process.exit(1)
    }

    const updatedContent = appPropsContent.replace(
      versionRegex,
      `const version = '${cleanVersion}'`
    )

    // Write the updated content back
    fs.writeFileSync(appPropsPath, updatedContent, 'utf8')

    console.log(`✅ Updated version in app-props.js to: ${cleanVersion}`)

    // Update package.json version
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonContent)

    const oldPackageVersion = packageJson.version
    packageJson.version = cleanVersion

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')

    console.log(`✅ Updated version in package.json from ${oldPackageVersion} to: ${cleanVersion}`)
  } catch (error) {
    console.error('❌ Error updating version:', error.message)
    process.exit(1)
  }
}

// Run the update if called directly
if (require.main === module) {
  updateVersion()
}

module.exports = updateVersion
