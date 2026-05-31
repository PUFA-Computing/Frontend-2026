/**
 * Centralized authorization helpers for "who is allowed to add data".
 *
 * Single source of truth — every form gate (button visibility, page guard,
 * submit handler) must read from these helpers. Backend mirrors the same
 * rule in `internal/services/access_control.go`; if you change one, change
 * the other.
 *
 * Rule:
 *   - Role 1 (Admin)      → always allowed.
 *   - Role 2 (Computizen)  → allowed only if the account is genuinely a
 *                            Faculty of Computer Science student account:
 *                            12-digit Student ID, prefix in CS_MAJOR_PREFIXES,
 *                            and onboarding marked complete.
 *   - Everything else (Guest = 6, PUFA/PUMA executive roles, missing data)
 *                            → blocked.
 */

import type { UserType } from "@/types/next-auth";

export const ROLE_ADMIN = 1;
export const ROLE_COMPUTIZEN = 2;
export const ROLE_PUFA_CS = 3;
export const ROLE_PUMA_IT = 4;
export const ROLE_PUMA_IS = 5;
export const ROLE_GUEST = 6;

/**
 * Major-code prefixes that mark a Student ID as belonging to the Faculty
 * of Computer Science. Mirrors `CS_PREFIXES` in
 * `(auth)/auth/complete-profile/_components/CompleteProfileForm.tsx` and
 * the backend's promotion logic in `services/auth_services.go`.
 */
export const CS_MAJOR_PREFIXES = ["001", "012", "013", "025"] as const;

const STUDENT_ID_REGEX = /^[0-9]{12}$/;

/** Anything the session might give us — narrow type so callers can pass session.user directly. */
type UserLike = Partial<
    Pick<
        UserType,
        | "role_id"
        | "student_id"
        | "student_id_verified"
        | "profile_completed"
        | "needs_completion"
    >
> | null | undefined;

/**
 * Returns true if the user holds a 12-digit Student ID whose major prefix
 * is one of the Faculty of Computer Science majors.
 */
export function hasFacultyStudentID(user: UserLike): boolean {
    if (!user?.student_id) return false;
    if (!STUDENT_ID_REGEX.test(user.student_id)) return false;
    const prefix = user.student_id.slice(0, 3);
    return (CS_MAJOR_PREFIXES as readonly string[]).includes(prefix);
}

/** True iff role_id === 6 (Guest). */
export function isGuest(user: UserLike): boolean {
    return user?.role_id === ROLE_GUEST;
}

/**
 * Authoritative "can this user create content?" check. Use this for every
 * write-capable button/form on the public app (projects, aspiration, …).
 *
 * Admins bypass the student-ID check (they may be staff with no SID).
 * Computizens must additionally be a verified Faculty of CS student account
 * that has finished onboarding.
 */
export function canCreateContent(user: UserLike): boolean {
    if (!user) return false;
    if (user.role_id === ROLE_ADMIN) return true;
    if (user.role_id !== ROLE_COMPUTIZEN) return false;

    // Computizen branch — must look like a real CS student account.
    if (user.profile_completed === false) return false;
    if (user.needs_completion === true) return false;
    return hasFacultyStudentID(user);
}

/**
 * Short, user-facing explanation for WHY a session is read-only.
 * Returns null when the user IS allowed to create content (no message needed).
 */
export function getRestrictionReason(user: UserLike): string | null {
    if (canCreateContent(user)) return null;

    if (!user) {
        return "Please sign in with a Faculty of Computer Science student account to add data.";
    }
    if (isGuest(user)) {
        return "Your account is registered as a Guest. Only Faculty of Computer Science students (Computizens) and administrators can add data — you can still browse everything in read-only mode.";
    }
    if (user.profile_completed === false || user.needs_completion === true) {
        return "Finish your onboarding (Student ID + batch year) to unlock writing data.";
    }
    if (!hasFacultyStudentID(user)) {
        return "Adding data is reserved for Faculty of Computer Science student accounts. Your Student ID isn't recognised as a CS major.";
    }
    return "You don't have permission to add data on this page.";
}
