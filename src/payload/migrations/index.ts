import * as migration_20250316_184729 from './20250316_184729';
import * as migration_20250318_213941 from './20250318_213941';
import * as migration_20250318_214044 from './20250318_214044';
import * as migration_20250419_165441 from './20250419_165441';
import * as migration_20250419_235903 from './20250419_235903';
import * as migration_20250517_155151 from './20250517_155151';
import * as migration_20250619_141252 from './20250619_141252';

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
    name: '20250619_141252'
  },
];
