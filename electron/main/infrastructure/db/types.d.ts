import { LibSQLDatabase } from 'drizzle-orm/libsql'
import * as schema from './schema'
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import { ResultSet } from '@libsql/client'
import { ExtractTablesWithRelations } from 'drizzle-orm'

export type DrizzleDb = LibSQLDatabase<typeof schema>
export type Executor =
  | DrizzleDb
  | SQLiteTransaction<
      'async',
      ResultSet,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
