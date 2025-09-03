# Electerm 数据工具

[English README](./README.md)

一个用于管理 Electerm 应用数据的命令行工具，支持从 v1 (NeDB) 到 v2 (SQLite) 的数据库迁移，以及数据导出。

## 功能特性

- 🔄 **数据库迁移**：将 Electerm 数据从 v1 (NeDB) 迁移到 v2 (SQLite)
- 📤 **数据导出**：将所有 Electerm 数据导出为一个包含明文密码的 JSON 文件
- 📊 **数据库信息**：显示当前 Electerm 数据库的信息
- 🔐 **密码解密**：导出时自动解密密码，便于备份

## 安装

### 推荐：npx 直接运行

无需安装，直接使用 npx 运行：

```bash
npx electerm-data-tool migrate
npx electerm-data-tool export ~/backup.json
npx electerm-data-tool info
```

### 全局安装

```bash
npm install -g electerm-data-tool
```

## 使用方法

### 命令总览

**npx 方式（无需安装）：**
```bash
npx electerm-data-tool [command] [options]
```

**全局安装方式：**
```bash
electerm-data-tool [command] [options]
```

可用命令：

- `migrate` - 数据库从 v1 迁移到 v2
- `export <path>` - 导出所有数据为 JSON 文件
- `info` - 显示数据库信息
- `--help` - 显示帮助信息
- `--version` - 显示版本号

### 1. 数据库迁移

将 Electerm 数据库从 v1 (NeDB) 迁移到 v2 (SQLite)：

```bash
electerm-data-tool migrate
```

此命令将：
- 检查是否需要迁移
- 将所有 NeDB 文件数据迁移到 SQLite 数据库
- 备份原始 NeDB 文件（带时间戳）
- 执行必要的数据升级

**注意**：需要 Node.js 22.0.0 及以上版本。

### 2. 数据导出

将所有 Electerm 数据导出为包含明文密码的 JSON 文件：

```bash
electerm-data-tool export /path/to/backup.json
```

示例：
```bash
electerm-data-tool export ~/electerm-backup-2025-09-03.json
```

### 3. 数据库信息

查看当前 Electerm 数据库信息：

```bash
electerm-data-tool info
```

将显示：
- 数据库类型（v1 NeDB 或 v2 SQLite）
- 各表数据条数
- 如需迁移会有提示

## 数据库自动检测

工具会自动检测当前数据库类型：
- **v1 (NeDB)**：原始文件型数据库
- **v2 (SQLite)**：新版数据库（需 Node.js 22+）

导出时：
- 检测到 v1 用 NeDB 方式导出
- 检测到 v2 用 SQLite 方式导出
- 密码自动解密为明文

## 数据结构

导出 JSON 结构如下：

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

## 密码处理

- Electerm 内部密码为加密存储
- 导出时自动解密为明文
- 导出数据不含 `passwordEncrypted` 字段
- 便于备份和迁移

## 依赖要求

- **Node.js**：16.0.0 及以上
- **SQLite (v2)**：需 Node.js 22.0.0 及以上
- **依赖包**：
  - `commander` - CLI 框架
  - `@yetzt/nedb` - NeDB 支持
  - `nanoid` - ID 生成

## 数据文件位置

- NeDB (v1)：`~/.electerm/users/{username}/electerm.{table}.nedb`
- SQLite (v2)：`~/.electerm/users/{username}/electerm.db`

迁移时 NeDB 文件会自动备份为：
- `electerm.bookmarks.nedb-{timestamp}.bak`

## 示例流程

```bash
# 1. 查看数据库状态
npx electerm-data-tool info

# 2. 迁移前导出备份
npx electerm-data-tool export ~/electerm-backup-before-migration.json

# 3. 执行迁移
npx electerm-data-tool migrate

# 4. 验证迁移结果
npx electerm-data-tool info

# 5. 迁移后再导出一次
npx electerm-data-tool export ~/electerm-backup-after-migration.json
```

## 常见问题

- **迁移报错/SQLite 报错**：请确认 Node.js 版本 >= 22
- **导出密码为乱码**：请升级到最新版工具
- **命令未找到**：请确认已全局安装或用 npx 运行

## 安全提示

- 导出文件包含明文密码，请妥善保存
- 用完请及时删除导出文件
- 本工具所有操作均在本地完成，不会上传数据

## 相关链接

- [Electerm 主项目](https://github.com/electerm/electerm)
- [English README](./README.md)
