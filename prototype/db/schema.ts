import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Each signed-in visitor owns an isolated demonstration workspace.
// Revision is compared atomically on every write to prevent lost updates.
export const workspaces = sqliteTable('workspaces', {
  ownerId: text('owner_id').primaryKey(),
  payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(0),
  updatedAt: text('updated_at').notNull(),
});
