import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export function keyOf(username) {
  return `xylonwebz:key:${username}`;
}
