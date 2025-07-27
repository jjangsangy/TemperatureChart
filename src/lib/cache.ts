import { LRUCache } from 'lru-cache';
import { ForecastData } from './weather'; // Import ForecastData

const cache = new LRUCache<string, ForecastData>({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 30, // 30 minutes in milliseconds
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

export default cache;
