# Electerm Data Tool

[中文文档 (Chinese README)](./README.zh-CN.md)

A command-line utility for managing Electerm application data, including database migration from v1 (NeDB) to v2 (SQLite) and data export functionality.

## Features

- 🔄 **Database Migration**: Migrate Electerm data from v1 (NeDB) to v2 (SQLite)
- 📤 **Data Export**: Export all Electerm data to a single JSON file with decrypted passwords
- 📊 **Database Info**: Display information about your current Electerm database
- 🔐 **Password Decryption**: Automatically decrypt passwords during export for readable backups

## Installation

### Quick Start with npx (Recommended)

No installation required! Run the tool directly using `npx`:

```bash
npx electerm-data-tool migrate
npx electerm-data-tool export ~/backup.json
npx electerm-data-tool info
```

### Global Installation

```bash
npm install -g electerm-data-tool
```

## Usage

### Command Overview

**Using npx (no installation required):**
```bash
npx electerm-data-tool [command] [options]
```

**Using globally installed version:**
```bash
electerm-data-tool [command] [options]
```

Available commands:

- `migrate` - Migrate database from v1 to v2
- `export <path>` - Export all data to JSON file  
- `info` - Display database information
- `--help` - Show help information
- `--version` - Show version number

### Global Options

- `--app-type <type>` - Specify application type (`desktop` or `web`)
  - `desktop` (default): Standard Electerm desktop application
  - `web`: Electerm web application with different path structure
- `-d, --data-path <path>` - Custom path to electerm data directory (for portable installations)

### 1. Database Migration

Migrate your Electerm database from v1 (NeDB) to v2 (SQLite):

```bash
electerm-data-tool migrate
```

This command will:
- Check if migration is needed
- Migrate all data from NeDB files to SQLite database
- Create backups of original NeDB files with timestamp
- Perform any necessary data upgrades

**Note**: Requires Node.js 22.0.0 or higher for SQLite support.

### 2. Data Export

Export all Electerm data to a JSON file with decrypted passwords:

```bash
electerm-data-tool export /path/to/backup.json
```

Example:
```bash
electerm-data-tool export ~/electerm-backup-2025-09-03.json
```

The exported JSON will contain:
- All bookmarks with decrypted passwords
- Bookmark groups and folder structure
- Terminal themes
- Quick commands
- Profiles
- Configuration settings
- And all other Electerm data

**Important**: The exported file contains plain-text passwords. Store it securely and delete when no longer needed.

### 3. Database Information

View information about your current Electerm database:

```bash
electerm-data-tool info
```

This will show:

- Database type (v1 NeDB or v2 SQLite)
- Number of records in each table
- Migration recommendations if applicable

## Application Types

The tool supports two application types with different path structures:

### Desktop Application (Default)

Standard Electerm desktop application using the default path structure:

```bash
electerm-data-tool info
# or explicitly specify desktop type
electerm-data-tool info --app-type desktop
```

**Default paths:**
- NeDB files: `{APP_PATH}/electerm/users/default_user/electerm.*.nedb`
- SQLite files: `{APP_PATH}/electerm/users/default_user/electerm*.db`

### Web Application

Electerm web application with customized path structure:

```bash
electerm-data-tool info --app-type web
```

**Web paths:**
- NeDB files: `{APP_PATH}/nedb-database/users/default_user/electerm.*.nedb`
- SQLite files: `{APP_PATH}/sqlite/electerm*.db`

### Custom Data Directory

You can specify a custom data directory using the `APP_PATH` environment variable:

```bash
# Example for web application
export APP_PATH="/path/to/your/data"
electerm-data-tool migrate --app-type web

# Example for desktop application  
export APP_PATH="/custom/path"
electerm-data-tool export backup.json --app-type desktop
```

**Complete web application example:**
```bash
# Set custom data directory
export APP_PATH="/Users/username/my-electerm-data"

# Check database status
electerm-data-tool info --app-type web

# Export data
electerm-data-tool export backup.json --app-type web

# Migrate from NeDB to SQLite
electerm-data-tool migrate --app-type web
```

### Portable Installations

For portable installations or custom data directories, use the `--data-path` option:

```bash
# Using --data-path option (recommended for portable installations)
electerm-data-tool info --data-path "/path/to/portable/electerm" --app-type desktop
electerm-data-tool export backup.json --data-path "/path/to/portable/electerm" --app-type desktop
electerm-data-tool migrate --data-path "/path/to/portable/electerm" --app-type desktop

# Web application with custom data path
electerm-data-tool info --data-path "/custom/data/directory" --app-type web
electerm-data-tool export backup.json --data-path "/custom/data/directory" --app-type web
electerm-data-tool migrate --data-path "/custom/data/directory" --app-type web
```

**Path Priority:**
1. `--data-path` option (highest priority)
2. `APP_PATH` environment variable  
3. Default system-specific path (lowest priority)

## Database Detection

The tool automatically detects whether you're using:

- **v1 Database (NeDB)**: Original file-based database format
- **v2 Database (SQLite)**: New SQLite-based format (Node.js 22+ required)

When exporting data:
- If v1 database is detected, uses NeDB module for data access
- If v2 database is detected, uses SQLite module for data access
- Passwords are automatically decrypted in both cases

## Data Structure

### Export Format

The exported JSON follows this structure:

```json
{
  "bookmarks": [...],
  "bookmarkGroups": [...],
  "terminalThemes": [...],
  "quickCommands": [...],
  "profiles": [...],
  "config": {...},
  "addressBookmarks": [...],
  "lastStates": [...],
  "data": [...],
  "log": [...],
  "dbUpgradeLog": [...]
}
```

### Password Handling

- Passwords stored in Electerm are encrypted using a simple character-based encryption
- During export, passwords are automatically decrypted to plain text
- The `passwordEncrypted` flag is removed from exported data
- Exported passwords are human-readable for backup purposes

## Requirements

- **Node.js**: 16.0.0 or higher
- **For SQLite (v2)**: Node.js 22.0.0 or higher

## File Locations

The tool operates on Electerm data stored in the standard locations:

**Database Files:**
- NeDB (v1): `~/.electerm/users/{username}/electerm.{table}.nedb`
- SQLite (v2): `~/.electerm/users/{username}/electerm.db`

**Backup Files:**
During migration, original NeDB files are renamed with timestamp:
- `electerm.bookmarks.nedb-{timestamp}.bak`

## Examples

### Complete Migration Workflow

**Using npx (recommended):**
```bash
# 1. Check current database status
npx electerm-data-tool info

# 2. Export current data as backup
npx electerm-data-tool export ~/electerm-backup-before-migration.json

# 3. Perform migration
npx electerm-data-tool migrate

# 4. Verify migration succeeded
npx electerm-data-tool info

# 5. Export migrated data to verify
npx electerm-data-tool export ~/electerm-backup-after-migration.json
```

**Using globally installed version:**
```bash
# 1. Check current database status
electerm-data-tool info

# 2. Export current data as backup
electerm-data-tool export ~/electerm-backup-before-migration.json

# 3. Perform migration
electerm-data-tool migrate

# 4. Verify migration succeeded
electerm-data-tool info

# 5. Export migrated data to verify
electerm-data-tool export ~/electerm-backup-after-migration.json
```

## Troubleshooting

### Migration Issues

**"Migration not needed"**: Your database is already v2 or no v1 files exist.

**SQLite errors**: Ensure you're using Node.js 22.0.0 or higher.

**Permission errors**: Ensure you have read/write access to Electerm data directory.

### Export Issues

**Empty export**: Check that Electerm has been run and contains data.

**Encrypted passwords in export**: The tool should automatically decrypt passwords. If you see encrypted text, there may be an issue with the decryption module.

### General Issues

**Command not found**: If installed globally, ensure npm global bin directory is in your PATH.

**Module errors**: Run `npm install` to ensure all dependencies are installed.

## Security Considerations

- **Exported files contain plain-text passwords** - store securely
- **Delete export files** after use if they're temporary backups
- **File permissions** - exported files inherit system default permissions
- **Local processing only** - no data is transmitted over network

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- [Electerm](https://github.com/electerm/electerm) - The main Electerm terminal application
- [Electerm Documentation](https://electerm.html5beta.com/) - Official documentation

## License

MIT License - see [LICENSE](LICENSE) file for details.
