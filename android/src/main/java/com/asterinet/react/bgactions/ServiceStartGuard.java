package com.asterinet.react.bgactions;

import java.util.HashSet;
import java.util.Set;

/**
 * Tracks service starts made with {@code startForegroundService()} until the service has handled
 * them in {@code onStartCommand}.
 *
 * <p>After {@code startForegroundService()} the service must call {@code startForeground()}.
 * If {@code stopService()} runs before that, the system crashes the app with
 * {@code ForegroundServiceDidNotStartInTimeException} ("Context.startForegroundService() did not
 * then call Service.startForeground()"). That crash is raised by the system, so it cannot be
 * caught. Instead, a stop requested while a start is still pending is deferred: the service
 * calls {@code startForeground()} first and then stops itself.
 */
final class ServiceStartGuard {
    static final String EXTRA_RUN_ID = "rnBackgroundActionsRunId";
    static final long NO_RUN_ID = -1;

    private static final Object LOCK = new Object();
    private static long nextRunId = 1;
    // Starts requested with startForegroundService() that onStartCommand has not handled yet
    private static final Set<Long> pendingRunIds = new HashSet<>();
    // Pending starts for which stop() was called before onStartCommand handled them
    private static final Set<Long> cancelledRunIds = new HashSet<>();

    private ServiceStartGuard() {
    }

    /** Registers a new start. Call right before {@code startForegroundService()}. */
    static long registerStart() {
        synchronized (LOCK) {
            final long runId = nextRunId++;
            pendingRunIds.add(runId);
            return runId;
        }
    }

    /**
     * Requests a stop for the given start.
     *
     * @return {@code true} if the service can be stopped right away, {@code false} if the start is
     * still pending and the service will stop itself once it has called {@code startForeground()}
     */
    static boolean requestStop(final long runId) {
        synchronized (LOCK) {
            if (pendingRunIds.contains(runId)) {
                cancelledRunIds.add(runId);
                return false;
            }
            return true;
        }
    }

    /**
     * Marks the start as handled (foreground reached, or the start was given up).
     *
     * @return {@code true} if a stop was requested while the start was pending
     */
    static boolean onStartHandled(final long runId) {
        synchronized (LOCK) {
            pendingRunIds.remove(runId);
            return cancelledRunIds.remove(runId);
        }
    }
}
