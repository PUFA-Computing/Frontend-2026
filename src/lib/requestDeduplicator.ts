// src/lib/requestDeduplicator.ts
/**
 * Request deduplication utility to prevent multiple simultaneous requests to the same endpoint
 * Uses Promise caching to share results across concurrent requests
 */

interface PendingRequest<T> {
    promise: Promise<T>;
    timestamp: number;
}

class RequestDeduplicator {
    private pendingRequests: Map<string, PendingRequest<any>>;
    private readonly CLEANUP_INTERVAL = 60000; // 1 minute
    private readonly MAX_PENDING_AGE = 30000; // 30 seconds

    constructor() {
        this.pendingRequests = new Map();

        // Periodic cleanup of stale pending requests
        if (typeof window !== 'undefined') {
            setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
        }
    }

    /**
     * Deduplicate a request by key
     * If a request with the same key is already pending, return the existing promise
     * Otherwise, execute the request function and cache the promise
     * 
     * @param key Unique identifier for the request
     * @param requestFn Function that returns a promise for the request
     * @returns Promise with the request result
     */
    async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
        // Check if there's already a pending request for this key
        const pending = this.pendingRequests.get(key);

        if (pending) {
            // Return the existing promise
            console.log(`[RequestDeduplicator] Reusing pending request for: ${key}`);
            return pending.promise;
        }

        // Create new request
        console.log(`[RequestDeduplicator] Creating new request for: ${key}`);
        const promise = requestFn()
            .then((result) => {
                // Clean up after successful completion
                this.pendingRequests.delete(key);
                return result;
            })
            .catch((error) => {
                // Clean up after error
                this.pendingRequests.delete(key);
                throw error;
            });

        // Store the pending request
        this.pendingRequests.set(key, {
            promise,
            timestamp: Date.now(),
        });

        return promise;
    }

    /**
     * Generate a cache key from URL and options
     * @param url Request URL
     * @param options Request options (method, body, etc.)
     * @returns Cache key string
     */
    generateKey(url: string, options?: RequestInit): string {
        const method = options?.method || 'GET';
        const body = options?.body ? JSON.stringify(options.body) : '';
        return `${method}:${url}:${body}`;
    }

    /**
     * Clear a specific pending request
     * @param key Request key to clear
     */
    clear(key: string): void {
        this.pendingRequests.delete(key);
    }

    /**
     * Clear all pending requests
     */
    clearAll(): void {
        this.pendingRequests.clear();
    }

    /**
     * Clean up stale pending requests
     * Removes requests that have been pending for too long (likely failed/stuck)
     */
    private cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        const pendingEntries = Array.from(this.pendingRequests.entries());
        for (const [key, request] of pendingEntries) {
            if (now - request.timestamp > this.MAX_PENDING_AGE) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            console.log(`[RequestDeduplicator] Cleaning up stale request: ${key}`);
            this.pendingRequests.delete(key);
        });
    }

    /**
     * Get statistics about pending requests
     */
    getStats() {
        return {
            pendingCount: this.pendingRequests.size,
            pendingKeys: Array.from(this.pendingRequests.keys()),
        };
    }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator();
export default requestDeduplicator;
