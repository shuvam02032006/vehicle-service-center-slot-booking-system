import React from 'react';
import {
  HelpCircle,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Terminal,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Operating Systems Project Documentation: Concurrency &amp; Synchronization
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic guide to Mutual Exclusion, Critical Section design, and Race Condition Prevention
        </p>
      </div>

      {/* 1. Core Problem Statement */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>1. The Core OS Concurrency Problem</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          In a modern multi-threaded automotive service booking system, multiple concurrent client processes or web threads may simultaneously issue reservation requests for the exact same physical resource:
        </p>

        <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl">
          Resource Identifier = bay:&#123;bayId&#125;:&#123;date&#125;:&#123;timeSlot&#125;
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Without synchronization, if Thread A and Thread B simultaneously perform the check:
          <br />
          <code className="text-slate-900 bg-slate-100 px-1 py-0.5 rounded font-mono">if (isSlotAvailable(bay, time)) &#123; bookSlot(bay, time); &#125;</code>
          <br />
          Both threads read that the slot is available, and both commit their reservations. This results in a catastrophic <strong>Race Condition</strong> leading to a <strong>Double Booking</strong>.
        </p>
      </div>

      {/* 2. Three Requirements of the Critical Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>2. The Three Critical Section Criteria</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <h4 className="font-bold text-blue-900">1. Mutual Exclusion</h4>
            <p className="text-blue-800 leading-snug">
              If thread \(T_i\) is executing in its critical section, then no other threads can be executing in their critical sections for that resource.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
            <h4 className="font-bold text-indigo-900">2. Progress</h4>
            <p className="text-indigo-800 leading-snug">
              If no thread is executing in its critical section and some threads wish to enter, only those threads not in remainder sections can decide who enters next.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <h4 className="font-bold text-emerald-900">3. Bounded Waiting</h4>
            <p className="text-emerald-800 leading-snug">
              There exists a bound on the number of times other threads are allowed to enter their critical sections after a thread has requested entry, preventing starvation.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Mutex Synchronization Flow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>3. Complete Mutex Booking Flow</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-2">
          <div className="text-slate-800 font-bold">Execution Step-by-Step:</div>
          <ol className="list-decimal pl-5 space-y-1 text-slate-700">
            <li><strong>Booking Request:</strong> Client thread generates booking payload with desired Bay and Time Slot.</li>
            <li><strong>Acquire Mutex:</strong> Thread calls <code className="bg-white px-1 py-0.5 rounded border border-slate-200">mutex.acquire(resourceKey)</code>. If locked, thread enters waiting queue.</li>
            <li><strong>Critical Section:</strong> Thread evaluates availability state atomically with exclusive lock.</li>
            <li><strong>Reserve Slot:</strong> If free, reservation is committed to storage. If taken, a conflict is detected and alternative slots are returned.</li>
            <li><strong>Release Mutex:</strong> Guaranteed in <code className="bg-white px-1 py-0.5 rounded border border-slate-200">finally</code> block, unlocking the resource and waking any queued threads.</li>
          </ol>
        </div>
      </div>

      {/* 4. Live Verification in This App */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
          How to Test &amp; Verify in This App
        </h3>
        <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
          <li>
            Go to <strong>OS Concurrency</strong> in the sidebar.
          </li>
          <li>
            Open the <strong>Race Condition Simulator</strong>.
          </li>
          <li>
            Select <strong>3 or 5 concurrent threads</strong> targeting Bay #1 at 10:00 AM.
          </li>
          <li>
            With <strong>Mutex: ENABLED</strong>: Observe that exactly 1 thread acquires the lock and reserves the slot; all other threads are rejected with a conflict notification and suggested alternatives!
          </li>
          <li>
            With <strong>Mutex: DISABLED</strong>: Watch the Double Booking Counter trigger, proving that lack of synchronization creates a classic OS race condition bug!
          </li>
        </ul>
      </div>
    </div>
  );
};
