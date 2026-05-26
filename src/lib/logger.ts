// src/lib/logger.ts
/**
 * Tiny env-aware logger.
 *
 * Why this exists:
 *   Across the codebase, `console.log`/`console.error` were called on every
 *   axios catch — including for completely expected 4xx responses (e.g. an
 *   un-logged-in user hitting an auth-protected endpoint). That made the
 *   server log impossible to read and leaked stack traces into prod.
 *
 * Rules:
 *   - In production we only emit `warn` and `error` (or nothing if
 *     NEXT_PUBLIC_LOG_LEVEL=silent). `next.config.js` also strips most
 *     `console.*` calls from client bundles in prod — this is the runtime
 *     belt to that suspenders.
 *   - In development we emit everything from the configured level up.
 *   - `expectedAxiosFailure(err)` returns true for the kind of axios errors
 *     that callers handle as normal control flow (400/401/403/404) — those
 *     should NEVER hit logger.error; use logger.debug at most.
 *
 * Levels: silent < error < warn < info < debug
 */

import { AxiosError } from "axios";

type Level = "silent" | "error" | "warn" | "info" | "debug";

const LEVEL_ORDER: Record<Level, number> = {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
};

function resolveLevel(): Level {
    const fromEnv = (
        process.env.NEXT_PUBLIC_LOG_LEVEL ||
        process.env.LOG_LEVEL ||
        ""
    ).toLowerCase();
    if (fromEnv in LEVEL_ORDER) {
        return fromEnv as Level;
    }
    return process.env.NODE_ENV === "production" ? "warn" : "debug";
}

const currentLevel = resolveLevel();

function enabled(level: Level): boolean {
    return LEVEL_ORDER[level] <= LEVEL_ORDER[currentLevel];
}

function fmt(scope: string, args: unknown[]): unknown[] {
    return [`[${scope}]`, ...args];
}

export const logger = {
    level: currentLevel,
    debug(scope: string, ...args: unknown[]) {
        if (enabled("debug")) console.debug(...fmt(scope, args));
    },
    info(scope: string, ...args: unknown[]) {
        if (enabled("info")) console.info(...fmt(scope, args));
    },
    warn(scope: string, ...args: unknown[]) {
        if (enabled("warn")) console.warn(...fmt(scope, args));
    },
    error(scope: string, ...args: unknown[]) {
        if (enabled("error")) console.error(...fmt(scope, args));
    },
};

/**
 * Returns true for axios errors that callers treat as normal control flow:
 *  - 400 Bad Request (e.g. validation)
 *  - 401 Unauthorized (no/invalid token — user just hasn't logged in)
 *  - 403 Forbidden  (logged in, lacks permission — UI shows a message)
 *  - 404 Not Found  (UI shows "not found")
 *
 * For these, the caller should *not* logger.error — at most logger.debug.
 */
export function isExpectedClientError(err: unknown): err is AxiosError {
    if (!(err instanceof AxiosError)) return false;
    const status = err.response?.status;
    return status === 400 || status === 401 || status === 403 || status === 404;
}

/**
 * Convenience: log an axios error at the right level automatically.
 *   - Expected 4xx  -> logger.debug
 *   - 5xx / network -> logger.error
 *   - Anything else -> logger.warn
 */
export function logAxiosError(scope: string, message: string, err: unknown) {
    if (err instanceof AxiosError) {
        const status = err.response?.status;
        const data = err.response?.data;
        if (status && status >= 500) {
            logger.error(scope, message, status, data ?? err.message);
        } else if (isExpectedClientError(err)) {
            logger.debug(scope, message, status, data ?? err.message);
        } else if (!err.response) {
            // No response = network error / timeout / CORS
            logger.error(scope, `${message} (network)`, err.message);
        } else {
            logger.warn(scope, message, status, data ?? err.message);
        }
        return;
    }
    logger.error(scope, message, err);
}
