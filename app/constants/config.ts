import SQLite from 'react-native-sqlite-storage';

const DB_NAME = 'MyMigrationDB';
const DB_VERSION = 1;

const migrations = [
  {
    version: 1,
    script: [
      `
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
    ],
  },
  {
    version: 2,
    script: [
      `
      CREATE TABLE IF NOT EXISTS new_movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movieName TEXT NOT NULL,
        price INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
      `
      INSERT INTO new_movies (id, movieName, price,created_at)
      SELECT id, name, price, created_at FROM movies;
    `,
      `
      DROP TABLE IF EXISTS movies;
    `,
      `
      ALTER TABLE new_movies RENAME TO movies;
    `,
    ],
  },
];

class Database {
  db: SQLite.SQLiteDatabase;
  constructor() {
    this.db = this.initializeDatabase();
  }

  initializeDatabase() {
    return SQLite.openDatabase(
      {name: DB_NAME, location: 'default'},
      this.handleDbSuccess,
      this.handleDbError,
    );
  }

  getDatabase() {
    return this.db;
  }

  handleDbSuccess = () => {
    console.log('Database opened successfully');
    this.runMigrations();
  };

  handleDbError = (error: SQLite.SQLError) => {
    console.error('Error opening database: ', error);
  };

  runMigrations() {
    this.db.transaction(tx => {
      tx.executeSql(
        'PRAGMA user_version;',
        [],
        (_, result) => {
          console.log(
            'RESULT OF PRAGMA USER_VERSION ',
            result,
            result.rows.item(0).user_version,
          );
          const currentVersion = result.rows.item(0).user_version;
          this.applyMigrations(currentVersion);
        },
        (_, error) => {
          console.error('Error getting database version: ', error);
        },
      );
    });
  }

  async applyMigrations(currentVersion: number) {
    for (let i = currentVersion; i < DB_VERSION; i++) {
      const migration = migrations.find(m => m.version === i + 1);
      if (migration) {
        try {
          this.db.transaction(tx => {
            migration.script.map((scpt, idx) => {
              tx.executeSql(
                scpt,
                [],
                s => {
                  console.log('Success on migration', s, idx);
                },
                e => {
                  console.log('ERROR on migration', e, idx);
                },
              );
              console.log(
                `Migration to version ${migration.version} applied successfully`,
              );
            });
          });

          await this.updateVersion(migration.version);
        } catch (error) {
          console.error(
            `Error applying migration ${migration.version}: `,
            error,
          );

          break;
        }
      }
    }
  }

  async updateVersion(newVersion: number) {
    await this.db.executeSql(`PRAGMA user_version = ${newVersion};`);
    console.log('Database version updated successfully');
  }
}

export default new Database();
