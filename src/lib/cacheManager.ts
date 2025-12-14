// src/lib/cacheManager.ts
/**
 * Centralized cache management system with dual-layer caching (memory + localStorage)
 * Provides TTL-based cache invalidation and persistence across page reloads
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
    defaultTTL: number; // Default TTL in milliseconds
    useLocalStorage: boolean;
    maxMemoryEntries: number;
}

class CacheManager {
    private memoryCache: Map<string, CacheEntry<any>>;
    private config: CacheConfig;
    private readonly STORAGE_PREFIX = 'pufa_cache_';

    constructor(config?: Partial<CacheConfig>) {
        this.memoryCache = new Map();
        this.config = {
            defaultTTL: 10 * 60 * 1000, // 10 minutes default
            useLocalStorage: typeof window !== 'undefined',
            maxMemoryEntries: 100,
            ...config,
        };

        // Clean up expired entries periodically
        if (typeof window !== 'undefined') {
            setInterval(() => this.cleanupExpired(), 5 * 60 * 1000); // Every 5 minutes
        }
    }

    /**
     * Get data from cache
     * @param key Cache key
     * @returns Cached data or null if not found/expired
     */
    get<T>(key: string): T | null {
        // Try memory cache first
        const memoryEntry = this.memoryCache.get(key);
        if (memoryEntry && !this.isExpired(memoryEntry)) {
            return memoryEntry.data as T;
        }

        // Try localStorage if enabled
        if (this.config.useLocalStorage) {
            const storageEntry = this.getFromLocalStorage<T>(key);
            if (storageEntry && !this.isExpired(storageEntry)) {
                // Restore to memory cache
                this.memoryCache.set(key, storageEntry);
                return storageEntry.data;
            }
        }

        return null;
    }

    /**
     * Set data in cache
     * @param key Cache key
     * @param data Data to cache
     * @param ttl Time to live in milliseconds (optional, uses default if not provided)
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.config.defaultTTL,
        };

        // Set in memory cache
        this.memoryCache.set(key, entry);

        // Enforce max memory entries
        if (this.memoryCache.size > this.config.maxMemoryEntries) {
            const firstKey = this.memoryCache.keys().next().value;
            this.memoryCache.delete(firstKey);
        }

        // Set in localStorage if enabled
        if (this.config.useLocalStorage) {
            this.setToLocalStorage(key, entry);
        }
    }

    /**
     * Invalidate cache entry
     * @param key Cache key or pattern (supports wildcards with *)
     */
    invalidate(key: string): void {
        // Handle wildcard patterns
        if (key.includes('*')) {
            const pattern = new RegExp('^' + key.replace(/\*/g, '.*') + '$');

            // Invalidate from memory
            const memoryKeys = Array.from(this.memoryCache.keys());
            for (const cacheKey of memoryKeys) {
                if (pattern.test(cacheKey)) {
                    this.memoryCache.delete(cacheKey);
                }
            }

            // Invalidate from localStorage
            if (this.config.useLocalStorage && typeof window !== 'undefined') {
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const storageKey = localStorage.key(i);
                    if (storageKey?.startsWith(this.STORAGE_PREFIX)) {
                        const cacheKey = storageKey.substring(this.STORAGE_PREFIX.length);
                        if (pattern.test(cacheKey)) {
                            keysToRemove.push(storageKey);
                        }
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
            }
        } else {
            // Exact key match
            this.memoryCache.delete(key);
            if (this.config.useLocalStorage && typeof window !== 'undefined') {
                localStorage.removeItem(this.STORAGE_PREFIX + key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.memoryCache.clear();

        if (this.config.useLocalStorage && typeof window !== 'undefined') {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(this.STORAGE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        }
    }

    /**
     * Check if cache entry is expired
     */
    private isExpired(entry: CacheEntry<any>): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    /**
     * Get entry from localStorage
     */
    private getFromLocalStorage<T>(key: string): CacheEntry<T> | null {
        try {
            const item = localStorage.getItem(this.STORAGE_PREFIX + key);
            if (!item) return null;
            return JSON.parse(item) as CacheEntry<T>;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Set entry to localStorage
     */
    private setToLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
        try {
            localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
        } catch (error) {
            // Handle quota exceeded or other localStorage errors
            console.error('Error writing to localStorage:', error);
            // Try to free up space by removing oldest entries
            this.cleanupOldestLocalStorageEntries(5);
        }
    }

    /**
   * Clean up expired entries from both memory and localStorage
   */
    private cleanupExpired(): void {
        // Clean memory cache
        const memoryEntries = Array.from(this.memoryCache.entries());
        for (const [key, entry] of memoryEntries) {
            if (this.isExpired(entry)) {
                this.memoryCache.delete(key);
            }
        }

        // Clean localStorage
        if (this.config.useLocalStorage && typeof window !== 'undefined') {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (storageKey?.startsWith(this.STORAGE_PREFIX)) {
                    const entry = this.getFromLocalStorage(storageKey.substring(this.STORAGE_PREFIX.length));
                    if (entry && this.isExpired(entry)) {
                        keysToRemove.push(storageKey);
                    }
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        }
    }

    /**
     * Remove oldest localStorage entries to free up space
     */
    private cleanupOldestLocalStorageEntries(count: number): void {
        if (typeof window === 'undefined') return;

        const entries: Array<{ key: string; timestamp: number }> = [];

        for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);
            if (storageKey?.startsWith(this.STORAGE_PREFIX)) {
                const entry = this.getFromLocalStorage(storageKey.substring(this.STORAGE_PREFIX.length));
                if (entry) {
                    entries.push({ key: storageKey, timestamp: entry.timestamp });
                }
            }
        }

        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest entries
        entries.slice(0, count).forEach(e => localStorage.removeItem(e.key));
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const memorySize = this.memoryCache.size;
        let localStorageSize = 0;

        if (this.config.useLocalStorage && typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(this.STORAGE_PREFIX)) {
                    localStorageSize++;
                }
            }
        }

        return {
            memoryEntries: memorySize,
            localStorageEntries: localStorageSize,
            maxMemoryEntries: this.config.maxMemoryEntries,
        };
    }
}

// Cache TTL configurations from environment or defaults
const CACHE_TTL = {
    EVENTS: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_EVENTS || '600') * 1000, // 10 minutes
    NEWS: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_NEWS || '600') * 1000, // 10 minutes
    USER: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_USER || '300') * 1000, // 5 minutes
    CANDIDATES: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_CANDIDATES || '900') * 1000, // 15 minutes
    ASPIRATIONS: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_ASPIRATIONS || '300') * 1000, // 5 minutes
    DEFAULT: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL_DEFAULT || '600') * 1000, // 10 minutes
};

// Export singleton instance
export const cacheManager = new CacheManager({
    defaultTTL: CACHE_TTL.DEFAULT,
});

export { CACHE_TTL };
export default cacheManager;
