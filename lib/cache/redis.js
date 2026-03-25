// Unified Redis client module
// Supports two modes:
// 1) ioredis when REDIS_URL is provided
// 2) Upstash REST API when UPSTASH_* env vars are provided

import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || null;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let ioredisClient = null;
let usingIORedis = false;
let usingUpstash = false;

if (REDIS_URL) {
  ioredisClient = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

  ioredisClient.on('error', (err) => console.error('Redis error:', err));
  ioredisClient.on('connect', () => console.info('Redis connected'));

  usingIORedis = true;
}

if (!usingIORedis && UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  usingUpstash = true;
}

async function executeCommand(command, args = []) {
  if (!usingUpstash) return null;

  try {
    const url = `${UPSTASH_REDIS_REST_URL}/${command}/${args.map(encodeURIComponent).join('/')}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Upstash error ${res.status}`);
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Upstash executeCommand error:', err);
    return null;
  }
}

async function executePost(commandArray) {
  if (!usingUpstash) return null;
  try {
    const res = await fetch(UPSTASH_REDIS_REST_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commandArray),
    });
    if (!res.ok) throw new Error(`Upstash POST error ${res.status}`);
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Upstash executePost error:', err);
    return null;
  }
}

const redis = {
  client: ioredisClient,
  // isConfigured true when either client is available
  isConfigured: usingIORedis || usingUpstash,

  async incr(key) {
    if (usingIORedis) return ioredisClient.incr(key);
    if (usingUpstash) return executeCommand('INCR', [key]);
    throw new Error('Redis not configured');
  },

  async expire(key, seconds) {
    if (usingIORedis) return ioredisClient.expire(key, seconds);
    if (usingUpstash) return executePost(['EXPIRE', key, seconds]);
    throw new Error('Redis not configured');
  },

  async ttl(key) {
    if (usingIORedis) return ioredisClient.ttl(key);
    if (usingUpstash) return executeCommand('TTL', [key]);
    throw new Error('Redis not configured');
  },

  async set(key, value, mode, duration) {
    if (usingIORedis) {
      if (mode && duration) return ioredisClient.set(key, value, mode, duration);
      return ioredisClient.set(key, value);
    }
    if (usingUpstash) {
      if (mode === 'EX' && duration) return executePost(['SET', key, value, 'EX', duration]);
      return executePost(['SET', key, value]);
    }
    throw new Error('Redis not configured');
  },

  async get(key) {
    if (usingIORedis) return ioredisClient.get(key);
    if (usingUpstash) return executeCommand('GET', [key]);
    throw new Error('Redis not configured');
  },

  async del(key) {
    if (usingIORedis) return ioredisClient.del(key);
    if (usingUpstash) return executeCommand('DEL', [key]);
    throw new Error('Redis not configured');
  },

  // Distributed lock using ioredis only
  async acquireLock(lockKey, ttlMs = 30000) {
    if (!usingIORedis) return null;
    const token = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const acquired = await ioredisClient.set(lockKey, token, 'PX', ttlMs, 'NX');
    return acquired ? token : null;
  },

  async releaseLock(lockKey, token) {
    if (!usingIORedis) return null;
    const lua = `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;
    return ioredisClient.eval(lua, 1, lockKey, token);
  },

  // Convenience JSON helpers
  async setJson(key, value, ttlSeconds = 300) {
    return this.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  async getJson(key) {
    const v = await this.get(key);
    if (!v) return null;
    try { return JSON.parse(v); } catch { return v; }
  }
};

export default redis;
