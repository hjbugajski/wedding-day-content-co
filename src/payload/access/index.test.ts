import { describe, expect, it } from 'vitest';

import {
  Role,
  hasRole,
  hasRoleField,
  hasRoleOrPublished,
  hasRoleOrSelf,
  hasRoleOrSelfField,
} from '@/payload/access';
import type { PayloadUsersCollection } from '@/payload/payload-types';

const makeUser = (roles: Role[] | null, id = 'user-1') =>
  roles ? ({ id, roles } as unknown as PayloadUsersCollection) : null;

const req = (user: PayloadUsersCollection | null) => ({ req: { user } }) as never;

describe('hasRole', () => {
  it('returns true when the user has any of the requested roles', () => {
    expect(hasRole(Role.Admin)(req(makeUser([Role.Admin])))).toBe(true);
    expect(hasRole(Role.Admin, Role.Editor)(req(makeUser([Role.Editor])))).toBe(true);
  });

  it('returns false when the user lacks all requested roles', () => {
    expect(hasRole(Role.Admin)(req(makeUser([Role.Editor])))).toBe(false);
  });

  it('returns false when the user is null', () => {
    expect(hasRole(Role.Admin)(req(null))).toBe(false);
  });
});

describe('hasRoleField', () => {
  it('delegates to the same role check', () => {
    expect(hasRoleField(Role.Admin)(req(makeUser([Role.Admin])))).toBe(true);
    expect(hasRoleField(Role.Admin)(req(makeUser([Role.Editor])))).toBe(false);
  });
});

describe('hasRoleOrSelf', () => {
  it('returns false when there is no user', () => {
    expect(hasRoleOrSelf(Role.Admin)(req(null))).toBe(false);
  });

  it('returns true when the user has the role', () => {
    expect(hasRoleOrSelf(Role.Admin)(req(makeUser([Role.Admin])))).toBe(true);
  });

  it('returns a self-id where clause when the user lacks the role', () => {
    const user = makeUser([Role.Editor], 'user-42');
    expect(hasRoleOrSelf(Role.Admin)(req(user))).toEqual({ id: { equals: 'user-42' } });
  });
});

describe('hasRoleOrSelfField', () => {
  it('returns true when the user has the role', () => {
    expect(
      hasRoleOrSelfField(Role.Admin)({
        req: { user: makeUser([Role.Admin]) },
      } as never),
    ).toBe(true);
  });

  it('returns true when ids match (self-editing)', () => {
    expect(
      hasRoleOrSelfField(Role.Admin)({
        req: { user: makeUser([Role.Editor], 'u1') },
        id: 'u1',
      } as never),
    ).toBe(true);
  });

  it('returns false when ids differ and role is missing', () => {
    expect(
      hasRoleOrSelfField(Role.Admin)({
        req: { user: makeUser([Role.Editor], 'u1') },
        id: 'other',
      } as never),
    ).toBe(false);
  });
});

describe('hasRoleOrPublished', () => {
  it('returns true when the user has the role', () => {
    expect(hasRoleOrPublished(Role.Admin)(req(makeUser([Role.Admin])))).toBe(true);
  });

  it('falls back to a published-only where clause when the role is missing or user is absent', () => {
    expect(hasRoleOrPublished(Role.Admin)(req(null))).toEqual({
      _status: { equals: 'published' },
    });
    expect(hasRoleOrPublished(Role.Admin)(req(makeUser([Role.Public])))).toEqual({
      _status: { equals: 'published' },
    });
  });
});
