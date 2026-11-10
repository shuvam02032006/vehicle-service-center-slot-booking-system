import { ResourceLock, ConcurrencyLogItem, BookingConflictEvent } from '../types';

export class SlotBookingMutexManager {
  private activeLocks: Map<string, ResourceLock> = new Map();
  private waitQueues: Map<string, Array<{
    threadId: string;
    requesterName: string;
    resolve: (lock: ResourceLock) => void;
    reject: (err: Error) => void;
    timestamp: number;
  }>> = new Map();
  private mutexGlobalState: 'IDLE' | 'ACQUIRING' | 'LOCKED' | 'CRITICAL_SECTION' | 'RELEASED' = 'IDLE';
  private logs: ConcurrencyLogItem[] = [];
  private conflictsPreventedCount: number = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    // Clean up expired locks periodically if any
    if (typeof window !== 'undefined') {
      window.setInterval(() => this.cleanupExpiredLocks(), 5000);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getGlobalState() {
    return this.mutexGlobalState;
  }

  public getActiveLocks(): ResourceLock[] {
    return Array.from(this.activeLocks.values());
  }

  public getConflictsPreventedCount(): number {
    return this.conflictsPreventedCount;
  }

  public getLogs(): ConcurrencyLogItem[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }

  public logEvent(
    threadId: string,
    event: ConcurrencyLogItem['event'],
    resourceKey: string,
    details: string,
    level: ConcurrencyLogItem['level'] = 'info'
  ) {
    const item: ConcurrencyLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      threadId,
      event,
      resourceKey,
      details,
      level
    };
    this.logs.unshift(item);
    if (this.logs.length > 100) {
      this.logs.pop();
    }
    this.notify();
    return item;
  }

  /**
   * Acquire mutex lock on a specific slot resource: bay:bayId:date:timeSlot
   */
  public async acquire(
    bayId: string,
    bayNumber: number,
    date: string,
    timeSlot: string,
    threadId: string,
    requesterName: string,
    timeoutMs: number = 8000
  ): Promise<ResourceLock> {
    const resourceKey = `bay:${bayId}:${date}:${timeSlot}`;
    this.mutexGlobalState = 'ACQUIRING';
    this.logEvent(
      threadId,
      'REQUEST_RECEIVED',
      resourceKey,
      `Thread ${threadId} requesting Mutex lock for Bay #${bayNumber} on ${date} @ ${timeSlot}`,
      'info'
    );
    this.notify();

    const existingLock = this.activeLocks.get(resourceKey);

    if (!existingLock) {
      // Immediate lock acquisition
      const lock: ResourceLock = {
        resourceKey,
        bayId,
        bayNumber,
        date,
        timeSlot,
        lockedByThreadId: threadId,
        requesterName,
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 15000 // 15 second safeguard
      };

      this.activeLocks.set(resourceKey, lock);
      this.mutexGlobalState = 'CRITICAL_SECTION';
      this.logEvent(
        threadId,
        'MUTEX_ACQUIRED',
        resourceKey,
        `Mutex lock GRANTED to Thread ${threadId}. Resource [${resourceKey}] locked exclusively.`,
        'success'
      );
      this.notify();
      return lock;
    }

    // Resource already locked! Queue thread or wait
    this.logEvent(
      threadId,
      'CONFLICT_DETECTED',
      resourceKey,
      `Resource [${resourceKey}] is already locked by Thread ${existingLock.lockedByThreadId}. Thread ${threadId} entering wait queue.`,
      'warning'
    );

    return new Promise<ResourceLock>((resolve, reject) => {
      if (!this.waitQueues.has(resourceKey)) {
        this.waitQueues.set(resourceKey, []);
      }

      const timer = setTimeout(() => {
        const queue = this.waitQueues.get(resourceKey) || [];
        this.waitQueues.set(resourceKey, queue.filter(item => item.threadId !== threadId));
        this.logEvent(
          threadId,
          'CONFLICT_DETECTED',
          resourceKey,
          `Thread ${threadId} timed out waiting for Mutex on [${resourceKey}]`,
          'error'
        );
        reject(new Error(`Mutex acquisition timed out for resource: ${resourceKey}`));
      }, timeoutMs);

      this.waitQueues.get(resourceKey)!.push({
        threadId,
        requesterName,
        resolve: (lock) => {
          clearTimeout(timer);
          resolve(lock);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
        timestamp: Date.now()
      });
      this.notify();
    });
  }

  /**
   * Release mutex lock on the specific resource
   */
  public release(resourceKey: string, threadId: string): void {
    const existingLock = this.activeLocks.get(resourceKey);
    if (!existingLock) {
      return;
    }

    if (existingLock.lockedByThreadId !== threadId) {
      console.warn(`Thread ${threadId} attempted to release lock held by ${existingLock.lockedByThreadId}`);
      return;
    }

    this.activeLocks.delete(resourceKey);
    this.mutexGlobalState = 'RELEASED';
    this.logEvent(
      threadId,
      'MUTEX_RELEASED',
      resourceKey,
      `Thread ${threadId} released Mutex lock on [${resourceKey}]. Resource unlocked.`,
      'info'
    );

    // Check if threads are waiting for this resource
    const queue = this.waitQueues.get(resourceKey);
    if (queue && queue.length > 0) {
      const nextThread = queue.shift()!;
      const lock: ResourceLock = {
        resourceKey,
        bayId: existingLock.bayId,
        bayNumber: existingLock.bayNumber,
        date: existingLock.date,
        timeSlot: existingLock.timeSlot,
        lockedByThreadId: nextThread.threadId,
        requesterName: nextThread.requesterName,
        acquiredAt: Date.now(),
        expiresAt: Date.now() + 15000
      };
      this.activeLocks.set(resourceKey, lock);
      this.mutexGlobalState = 'CRITICAL_SECTION';
      this.logEvent(
        nextThread.threadId,
        'MUTEX_ACQUIRED',
        resourceKey,
        `Mutex lock transferred to queued Thread ${nextThread.threadId} for [${resourceKey}]`,
        'success'
      );
      nextThread.resolve(lock);
    } else {
      if (this.activeLocks.size === 0) {
        this.mutexGlobalState = 'IDLE';
      }
    }

    this.notify();
  }

  public recordConflictPrevented() {
    this.conflictsPreventedCount += 1;
    this.notify();
  }

  private cleanupExpiredLocks() {
    const now = Date.now();
    let changed = false;
    for (const [key, lock] of this.activeLocks.entries()) {
      if (now > lock.expiresAt) {
        this.activeLocks.delete(key);
        this.logEvent('SYSTEM_CLEANUP', 'MUTEX_RELEASED', key, `Expired lock released on [${key}]`, 'warning');
        changed = true;
      }
    }
    if (changed) {
      if (this.activeLocks.size === 0) {
        this.mutexGlobalState = 'IDLE';
      }
      this.notify();
    }
  }

  public resetAll() {
    this.activeLocks.clear();
    this.waitQueues.clear();
    this.logs = [];
    this.conflictsPreventedCount = 0;
    this.mutexGlobalState = 'IDLE';
    this.notify();
  }
}

export const globalMutexManager = new SlotBookingMutexManager();
