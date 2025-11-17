import * as migration_20250316_184729 from './20250316_184729';
import * as migration_20250318_213941 from './20250318_213941';
import * as migration_20250318_214044 from './20250318_214044';
import * as migration_20250419_165441 from './20250419_165441';
import * as migration_20250419_235903 from './20250419_235903';
import * as migration_20250517_155151 from './20250517_155151';
import * as migration_20250619_141252 from './20250619_141252';
import * as migration_20250727_202846 from './20250727_202846';
import * as migration_20250830_023858 from './20250830_023858';
import * as migration_20251101_180541 from './20251101_180541';
import * as migration_20251116_213521 from './20251116_213521';
import * as migration_20251117_004412 from './20251117_004412';

export const migrations = [
  {
    up: migration_20250316_184729.up,
    down: migration_20250316_184729.down,
    name: '20250316_184729',
  },
  {
    up: migration_20250318_213941.up,
    down: migration_20250318_213941.down,
    name: '20250318_213941',
  },
  {
    up: migration_20250318_214044.up,
    down: migration_20250318_214044.down,
    name: '20250318_214044',
  },
  {
    up: migration_20250419_165441.up,
    down: migration_20250419_165441.down,
    name: '20250419_165441',
  },
  {
    up: migration_20250419_235903.up,
    down: migration_20250419_235903.down,
    name: '20250419_235903',
  },
  {
    up: migration_20250517_155151.up,
    down: migration_20250517_155151.down,
    name: '20250517_155151',
  },
  {
    up: migration_20250619_141252.up,
    down: migration_20250619_141252.down,
    name: '20250619_141252',
  },
  {
    up: migration_20250727_202846.up,
    down: migration_20250727_202846.down,
    name: '20250727_202846',
  },
  {
    up: migration_20250830_023858.up,
    down: migration_20250830_023858.down,
    name: '20250830_023858',
  },
  {
    up: migration_20251101_180541.up,
    down: migration_20251101_180541.down,
    name: '20251101_180541',
  },
  {
    up: migration_20251116_213521.up,
    down: migration_20251116_213521.down,
    name: '20251116_213521',
  },
  {
    up: migration_20251117_004412.up,
    down: migration_20251117_004412.down,
    name: '20251117_004412'
  },
];
