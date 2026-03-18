'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { LearnToolConfig } from '@/lib/learn/pages';
import { ServiceConfig } from '@/lib/services';

interface DeadlineInfo {
  name: string;
  dueDate: Date;
  lateFeePerDay: number;
  maxLateFee?: number;
}

const DEADLINE_DATA: Record<string, DeadlineInfo> = {
  'gst-due-dates': {
    name: 'GSTR-3B (Monthly)',
    dueDate: getNextGstr3bDueDate(),
    lateFeePerDay: 50,
    maxLateFee: 5000,
  },
  'director-kyc': {
    name: 'Director KYC (DIR-3)',
    dueDate: new Date(new Date().getFullYear(), 8, 30), // Sep 30
    lateFeePerDay: 500,
  },
  'gst-annual': {
    name: 'GSTR-9 Annual Return',
    dueDate: new Date(new Date().getFullYear(), 11, 31), // Dec 31
    lateFeePerDay: 200,
  },
};

function getNextGstr3bDueDate(): Date {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Due date is 20th of current month
  let dueDate = new Date(currentYear, currentMonth, 20);

  // If we're past the 20th, next due date is 20th of next month
  if (now > dueDate) {
    dueDate = new Date(currentYear, currentMonth + 1, 20);
  }

  return dueDate;
}

export function DeadlineTracker({ config, ctaService }: {
  config: LearnToolConfig;
  ctaService: ServiceConfig;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const deadlineInfo = DEADLINE_DATA[config.deadlineType ?? 'gst-due-dates'];
  const daysRemaining = Math.ceil((deadlineInfo.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isPastDue = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 7;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Deadline tracker
        </p>
        <p className="font-semibold text-foreground mt-1">{config.title}</p>
      </div>

      <div className="p-6">
        <div className={`rounded-lg p-4 ${
          isPastDue
            ? 'bg-red-500/10 border border-red-500/20'
            : isUrgent
            ? 'bg-[hsl(var(--ollvy-amber))]/10 border border-[hsl(var(--ollvy-amber))]/20'
            : 'bg-muted/30 border border-border'
        }`}>
          <div className="flex items-start gap-3">
            {isPastDue ? (
              <AlertTriangle size={20} className="text-red-500 shrink-0" />
            ) : isUrgent ? (
              <AlertTriangle size={20} className="text-[hsl(var(--ollvy-amber))] shrink-0" />
            ) : (
              <Clock size={20} className="text-muted-foreground shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {deadlineInfo.name}
              </p>
              <p className="text-lg font-bold text-foreground mt-1">
                Due: {formatDate(deadlineInfo.dueDate)}
              </p>
              <p className={`text-sm mt-2 ${
                isPastDue ? 'text-red-500' : isUrgent ? 'text-[hsl(var(--ollvy-amber))]' : 'text-muted-foreground'
              }`}>
                {isPastDue
                  ? `${Math.abs(daysRemaining)} days overdue - penalty accruing at ₹${deadlineInfo.lateFeePerDay}/day`
                  : daysRemaining === 0
                  ? 'Due today!'
                  : `${daysRemaining} days remaining`
                }
              </p>
            </div>
          </div>
        </div>

        {isPastDue && (
          <div className="mt-4 p-4 rounded-lg bg-red-500/5 border border-red-500/10">
            <p className="text-sm font-medium text-foreground">
              Estimated penalty so far:
            </p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              ₹{Math.min(
                Math.abs(daysRemaining) * deadlineInfo.lateFeePerDay,
                deadlineInfo.maxLateFee ?? Infinity
              ).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Late fee: ₹{deadlineInfo.lateFeePerDay}/day
              {deadlineInfo.maxLateFee && ` (max ₹${deadlineInfo.maxLateFee.toLocaleString('en-IN')})`}
            </p>
          </div>
        )}

        <div className="mt-4">
          <Button className="w-full" asChild>
            <a href={`/services/${ctaService.slug}?utm_source=learn_tool&utm_medium=deadline_tracker`}>
              {isPastDue
                ? 'File now - stop the penalty'
                : `Book ${ctaService.shortName} - ₹${(ctaService.ollvyFee + (ctaService.govtFee ?? 0)).toLocaleString('en-IN')}`
              }
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
