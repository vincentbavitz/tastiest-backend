import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return this.cache.get<string>(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.cache.set(key, value, { ttl });
  }
}
