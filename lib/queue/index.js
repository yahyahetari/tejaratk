// lib/queue/index.js
// BullMQ queue factory and connection

import * as Bull from 'bullmq';
import Redis from '../cache/redis.js';

const Queue = Bull.Queue;
const Worker = Bull.Worker;
const QueueScheduler = Bull.QueueScheduler;

const connection = Redis.client ? { connection: Redis.client } : null;

export function createQueue(name) {
  if (!connection) {
    throw new Error('Redis not configured — cannot create queue');
  }

  // Ensure scheduler exists for delayed jobs and retries
  new QueueScheduler(name, connection);

  return new Queue(name, connection);
}

export function createWorker(name, processor) {
  if (!connection) {
    throw new Error('Redis not configured — cannot create worker');
  }

  return new Worker(name, processor, connection);
}
