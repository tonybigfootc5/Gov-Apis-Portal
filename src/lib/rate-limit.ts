type Entry = {
  count: number;
  resetAt: number;
};

const stores = new Map<string, Map<string, Entry>>();

function getStore(bucket: string) {
  let store = stores.get(bucket);
  if (!store) {
    store = new Map<string, Entry>();
    stores.set(bucket, store);
  }
  return store;
}

export function rateLimit(bucket: string, key: string, limit: number, windowMs: number) {
  const store = getStore(bucket);
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}
