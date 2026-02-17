import { LibSQLDatabase } from 'drizzle-orm/libsql'
import * as schema from './schema'

export type DrizzleDb = LibSQLDatabase<typeof schema>
