import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { getBlocksToJsonMigrator } from '@payloadcms/db-postgres/migration-utils'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Configure migration options (optional)
const BATCH_SIZE = 100 // Number of entities to process per batch
const TEMP_FOLDER = path.resolve(dirname, '.payload-blocks-migration') // Folder path to store migration batch


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  
  const migrator = getBlocksToJsonMigrator(payload)
  migrator.setTempFolder(TEMP_FOLDER)
  await migrator.collectAndSaveEntitiesToBatches(req, { batchSize: BATCH_SIZE })
  
  await db.execute(sql`
   `)
  payload.logger.info("Executed blocks to JSON migration statements.")
  
  await migrator.migrateEntitiesFromTempFolder(req, { clearBatches: true })
    
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
    // Migration code
}
