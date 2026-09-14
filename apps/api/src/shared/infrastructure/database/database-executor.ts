import type { db } from "./connection.js"

// Both the database connection and a transaction expose these query methods.
export type DatabaseExecutor = Pick<typeof db, "select" | "insert" | "update">
