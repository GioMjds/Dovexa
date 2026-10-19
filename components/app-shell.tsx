'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions';
import { QuickInteractionLogger } from '@/features/interactions/components/quick-interaction-logger';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loggerOpen, setLoggerOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <span className="text-sm font-semibold tracking-tight text-foreground font-heading">
            Dovexa
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            CRM
          </span>
        </div>

        <div className="p-3">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setLoggerOpen(true)}
            className="w-full justify-between shadow-xs font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="size-4" /> Log Interaction
            </span>
            <kbd className="rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-mono text-primary-foreground">
              L
            </kbd>
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href as any}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <p className="truncate text-xs text-muted-foreground">{email}</p>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-6">{children}</main>

      <QuickInteractionLogger
        open={loggerOpen}
        onOpenChange={setLoggerOpen}
      />
    </div>
  );
}
