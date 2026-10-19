'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { QuickInteractionLogger } from '@/features/interactions/components/quick-interaction-logger';

const SAMPLE_FOLLOW_UPS = [
  {
    id: 'f1',
    name: 'Elena Rostova',
    org: 'Apex Dynamics',
    role: 'VP Product',
    daysOverdue: 2,
    cadence: 'Every 14 days',
    lastTopic: 'Discussed Q3 angel syndicate allocation over Zoom.',
  },
  {
    id: 'f2',
    name: 'Marcus Vance',
    org: 'Foundry Ventures',
    role: 'General Partner',
    daysOverdue: 0,
    cadence: 'Every 30 days',
    lastTopic:
      'Shared draft memo on database performance and local-first architecture.',
  },
  {
    id: 'f3',
    name: 'Sarah Chen',
    org: 'Kernel Labs',
    role: 'Founder & CEO',
    daysOverdue: 5,
    cadence: 'Every 7 days',
    lastTopic:
      'Offered intro to senior infra engineer for upcoming seed round.',
  },
];

const RECENT_INTERACTIONS: {
  id: string;
  contactName: string;
  type: 'CALL' | 'MEETING' | 'MESSAGE' | 'EMAIL';
  summary: string;
  occurred: string;
  nextFollowUp: string | null;
}[] = [
  {
    id: 'i1',
    contactName: 'David K.',
    type: 'CALL' as const,
    summary:
      'Caught up on hiring pipeline. Will review shortlisted engineering candidates Friday.',
    occurred: '2 hours ago',
    nextFollowUp: 'In 3 days',
  },
  {
    id: 'i2',
    contactName: 'Elena Rostova',
    type: 'MEETING' as const,
    summary:
      'Coffee at Blue Bottle. Agreed to coordinate on angel co-investment terms.',
    occurred: 'Yesterday',
    nextFollowUp: 'Overdue',
  },
  {
    id: 'i3',
    contactName: 'Alex Rivera',
    type: 'MESSAGE' as const,
    summary:
      'Shared Figma design tokens review and feedback on command palette accessibility.',
    occurred: '3 days ago',
    nextFollowUp: null,
  },
];

export default function HomePage() {
  const [loggerOpen, setLoggerOpen] = React.useState(false);
  const [targetContact, setTargetContact] = React.useState<{
    id: string;
    name: string;
    org?: string;
  } | null>(null);

  function openLoggerFor(contact?: { id: string; name: string; org?: string }) {
    if (contact) {
      setTargetContact(contact);
    } else {
      setTargetContact(null);
    }
    setLoggerOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 sm:px-8 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-xs tracking-wider">
            D
          </div>
          <span className="font-heading font-semibold text-sm tracking-tight text-foreground">
            Dovexa
          </span>
          <span className="hidden sm:inline-block rounded border border-border bg-secondary px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
            Personal CRM
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-mono mr-2">
            <span>Press</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
              L
            </kbd>
            <span>anywhere to log</span>
          </div>

          <Button
            size="sm"
            onClick={() => openLoggerFor()}
            className="gap-1.5 shadow-xs font-medium"
          >
            <Plus className="size-4" />
            <span>Log Interaction</span>
            <kbd className="hidden sm:inline-block rounded bg-primary-foreground/20 px-1 text-[10px] font-mono text-primary-foreground">
              L
            </kbd>
          </Button>

          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Workspace Hero & Status */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
                Relationship Command
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl mt-1 leading-relaxed">
                A private, fast, self-owned personal CRM. Capture interactions
                in seconds, track cadences, and never let important
                relationships slip.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>
          </div>
        </section>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Who to Reach Out To Today (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h2 className="text-sm font-heading font-semibold text-foreground">
                  Who to Reach Out to Today
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {SAMPLE_FOLLOW_UPS.length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_FOLLOW_UPS.map((contact) => (
                <div
                  key={contact.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar size="default" className="mt-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {contact.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {contact.org} ({contact.role})
                        </span>
                        {contact.daysOverdue > 0 ? (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            {contact.daysOverdue}d overdue
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            Due today
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Last: {contact.lastTopic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        openLoggerFor({
                          id: contact.id,
                          name: contact.name,
                          org: contact.org,
                        })
                      }
                      className="text-xs gap-1 group-hover:border-primary/50 group-hover:text-primary transition-colors"
                    >
                      <Plus className="size-3" />
                      Log Touch
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Interactions Timeline (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <h2 className="text-sm font-heading font-semibold text-foreground">
                  Recent Interactions
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Latest stream
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {RECENT_INTERACTIONS.map((item) => {
                const Icon =
                  item.type === 'CALL'
                    ? Phone
                    : item.type === 'MEETING'
                      ? Users
                      : item.type === 'EMAIL'
                        ? Mail
                        : MessageSquare;

                return (
                  <div key={item.id} className="p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 items-center justify-center rounded bg-accent text-accent-foreground">
                          <Icon className="size-3" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {item.contactName}
                        </span>
                        <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-mono">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {item.occurred}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed pl-6">
                      {item.summary}
                    </p>

                    {item.nextFollowUp && (
                      <div className="pl-6 flex items-center gap-1 text-[11px] text-primary">
                        <Clock className="size-3" />
                        <span>Follow-up: {item.nextFollowUp}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Guarantees / Principles Banner */}
        <section className="rounded-xl border border-border bg-secondary/30 p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Zap className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium mb-0.5">
                  Sub-10-Second Logging
                </strong>
                <p className="text-muted-foreground leading-normal">
                  Hit{' '}
                  <kbd className="rounded border bg-background px-1 py-0.2 font-mono">
                    L
                  </kbd>
                  , type one line, press{' '}
                  <kbd className="rounded border bg-background px-1 py-0.2 font-mono">
                    ⌘Enter
                  </kbd>
                  . Done.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium mb-0.5">
                  Private & Self-Owned
                </strong>
                <p className="text-muted-foreground leading-normal">
                  All data scoped by your user ID. Full export and ownership of
                  every relationship touchpoint.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-medium mb-0.5">
                  Calm Prioritization
                </strong>
                <p className="text-muted-foreground leading-normal">
                  No sales funnels, pipeline stress, or gamification badges.
                  Pure relational memory.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Quick Interaction Logger Component */}
      <QuickInteractionLogger
        open={loggerOpen}
        onOpenChange={setLoggerOpen}
        defaultContactId={targetContact?.id}
        defaultContactName={targetContact?.name}
        defaultContactOrg={targetContact?.org}
      />
    </div>
  );
}
