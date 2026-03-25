// scripts/worker.js
// Simple worker runner to process background jobs (run with `node scripts/worker.js`)

import { createWorker } from '../lib/queue/index.js';

// Example processor for 'subscriptions' queue
const processor = async (job) => {
  console.log('Processing job', job.name, job.id, job.data);

  // Dynamic import to avoid heavy startup cost
  if (job.name === 'checkSubscriptions') {
    const mod = await import('../lib/subscription-checker.js');
    await mod.checkAllSubscriptions();
    return { ok: true };
  }

  return { ok: true };
};

async function start() {
  try {
    const worker = createWorker('subscriptions', processor);
    worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
    worker.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));

    console.log('Worker started for queue: subscriptions');
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

start();
