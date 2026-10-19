"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import {
  Phone,
  Users,
  MessageSquare,
  Mail,
  Calendar as CalendarIcon,
  Search,
  Check,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  logInteractionAction,
  deleteInteractionAction,
} from "@/features/interactions/actions";
import {
  searchContactsAction,
  type ContactSearchResult,
} from "@/features/contacts/actions";
import type { InteractionType } from "@/features/interactions/schemas";

const INTERACTION_TYPES: {
  value: InteractionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "MEETING", label: "Meeting", icon: Users },
  { value: "CALL", label: "Call", icon: Phone },
  { value: "MESSAGE", label: "Message", icon: MessageSquare },
  { value: "EMAIL", label: "Email", icon: Mail },
];

export interface QuickInteractionLoggerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultContactId?: string;
  defaultContactName?: string;
  defaultContactOrg?: string;
  onSuccess?: () => void;
}

export function QuickInteractionLogger({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultContactId,
  defaultContactName,
  defaultContactOrg,
  onSuccess,
}: QuickInteractionLoggerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = React.useCallback(
    (val: boolean) => {
      if (setControlledOpen) {
        setControlledOpen(val);
      } else {
        setInternalOpen(val);
      }
    },
    [setControlledOpen]
  );

  // Form states
  const [selectedContact, setSelectedContact] =
    React.useState<ContactSearchResult | null>(
      defaultContactId && defaultContactName
        ? {
            id: defaultContactId,
            firstName: defaultContactName.split(" ")[0] || "",
            lastName: defaultContactName.split(" ").slice(1).join(" ") || null,
            nickname: null,
            title: null,
            organizationName: defaultContactOrg ?? null,
            lastContactedAt: null,
          }
        : null
    );

  const [type, setType] = React.useState<InteractionType>("MEETING");
  const [summary, setSummary] = React.useState("");
  const [followUpDate, setFollowUpDate] = React.useState<Date | null>(null);
  const [isFollowUpPopoverOpen, setIsFollowUpPopoverOpen] = React.useState(false);

  // Search & Contacts autocomplete
  const [searchQuery, setSearchQuery] = React.useState("");
  const [contacts, setContacts] = React.useState<ContactSearchResult[]>([]);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);

  // Validation & Submitting
  const [showErrors, setShowErrors] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Refs for precise keyboard navigation
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Reset form helper
  const resetForm = React.useCallback(() => {
    if (!defaultContactId) {
      setSelectedContact(null);
    }
    setType("MEETING");
    setSummary("");
    setFollowUpDate(null);
    setSearchQuery("");
    setShowErrors(false);
    setHighlightedIndex(0);
  }, [defaultContactId]);

  // Global "L" Hotkey listener
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is actively in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (e.key.toLowerCase() === "l" && !isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  // Handle Dialog open transition & auto-focus
  React.useEffect(() => {
    if (isOpen) {
      setShowErrors(false);
      // Query recent contacts when opening
      searchContactsAction("").then((res) => {
        if (res.ok) setContacts(res.data);
      });

      // Focus management
      setTimeout(() => {
        if (selectedContact) {
          textareaRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 50);
    } else {
      resetForm();
    }
  }, [isOpen, selectedContact, resetForm]);

  // Fetch search results on query change
  React.useEffect(() => {
    if (!isOpen || selectedContact) return;

    let active = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      const res = await searchContactsAction(searchQuery);
      if (active && res.ok) {
        setContacts(res.data);
        setHighlightedIndex(0);
        setIsSearching(false);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, isOpen, selectedContact]);

  // Contact Selection
  function handleSelectContact(contact: ContactSearchResult) {
    setSelectedContact(contact);
    setSearchQuery("");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 40);
  }

  // Keyboard navigation inside dialog
  function handleDialogKeyDown(e: React.KeyboardEvent) {
    // ⌘Enter or Ctrl+Enter to submit
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Escape to close
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    // When inside search input, handle ArrowUp / ArrowDown / Enter
    if (!selectedContact && document.activeElement === searchInputRef.current) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < contacts.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && contacts[highlightedIndex]) {
        e.preventDefault();
        handleSelectContact(contacts[highlightedIndex]);
      }
    }
  }

  // Submit Handler with Optimistic Feedback & Undo
  async function handleSubmit() {
    if (!selectedContact || !summary.trim()) {
      setShowErrors(true);
      if (!selectedContact) {
        searchInputRef.current?.focus();
      } else {
        textareaRef.current?.focus();
      }
      return;
    }

    const payload = {
      contactId: selectedContact.id,
      type,
      summary: summary.trim(),
      occurredAt: new Date(),
      nextFollowUpAt: followUpDate ?? undefined,
    };

    const contactName = [selectedContact.firstName, selectedContact.lastName]
      .filter(Boolean)
      .join(" ");

    // Optimistic close
    setIsOpen(false);
    setIsSubmitting(true);

    const toastId = toast.loading(`Logging interaction with ${contactName}...`);

    try {
      const res = await logInteractionAction(payload);

      if (res.ok) {
        const interactionId = res.data.id;
        toast.success(`Logged ${type.toLowerCase()} with ${contactName}`, {
          id: toastId,
          description: followUpDate
            ? `Follow-up set for ${format(followUpDate, "MMM d")}`
            : "Contact timeline and cadence updated",
          action: {
            label: "Undo",
            onClick: async () => {
              const undoRes = await deleteInteractionAction(interactionId);
              if (undoRes.ok) {
                toast.info("Interaction undone");
                onSuccess?.();
              } else {
                toast.error("Could not undo interaction");
              }
            },
          },
        });
        onSuccess?.();
      } else {
        toast.error("Failed to log interaction", {
          id: toastId,
          description: res.error,
        });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="interaction-logger-title"
      onKeyDown={handleDialogKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog Surface (Aligned with DESIGN.md 10px rounded, 1px border, subtle depth) */}
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-border bg-card p-5 text-card-foreground shadow-2xl transition-all duration-150",
          "animate-in zoom-in-95 fade-in-0 sm:max-w-xl",
          "focus:outline-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2
                id="interaction-logger-title"
                className="text-base font-semibold leading-none tracking-tight text-foreground font-heading"
              >
                Log Interaction
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Capture quick notes in under 10 seconds. Press{" "}
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                  ⌘Enter
                </kbd>{" "}
                to save.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* 1. Contact Selector / Combobox */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Contact <span className="text-destructive">*</span>
            </label>

            {selectedContact ? (
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {selectedContact.firstName[0]}
                      {selectedContact.lastName ? selectedContact.lastName[0] : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <div className="text-sm font-medium text-foreground truncate">
                      {selectedContact.firstName} {selectedContact.lastName ?? ""}
                    </div>
                    {selectedContact.organizationName && (
                      <div className="text-xs text-muted-foreground truncate">
                        {selectedContact.organizationName}
                      </div>
                    )}
                  </div>
                </div>

                {!defaultContactId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setSelectedContact(null);
                      setTimeout(() => searchInputRef.current?.focus(), 50);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Change
                  </Button>
                )}
              </div>
            ) : (
              <div className="relative">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-xs transition-colors",
                    showErrors && !selectedContact
                      ? "border-destructive ring-1 ring-destructive"
                      : "border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30"
                  )}
                >
                  <Search className="size-4 text-muted-foreground shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contact by name or organization..."
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    aria-label="Search contacts"
                  />
                  {isSearching && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Searching...
                    </span>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {contacts.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
                    {contacts.map((contact, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <div
                          key={contact.id}
                          onClick={() => handleSelectContact(contact)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 cursor-pointer text-sm transition-colors",
                            isHighlighted
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Avatar size="sm">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {contact.firstName[0]}
                                {contact.lastName ? contact.lastName[0] : ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                              {contact.firstName} {contact.lastName ?? ""}
                            </span>
                            {contact.organizationName && (
                              <span className="text-xs text-muted-foreground truncate">
                                · {contact.organizationName}
                              </span>
                            )}
                          </div>
                          {isHighlighted && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ↵ select
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {showErrors && !selectedContact && (
                  <p className="mt-1 text-xs text-destructive">
                    Please select a contact to log this interaction for.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 2. Interaction Type Selector (Segment Pills) */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-border bg-secondary/30 p-1">
              {INTERACTION_TYPES.map(({ value, label, icon: Icon }) => {
                const isActive = type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all outline-none",
                      isActive
                        ? "bg-card text-foreground shadow-xs border border-border/80 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    <Icon className={cn("size-3.5", isActive ? "text-primary" : "")} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Summary / Notes Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="interaction-summary"
                className="text-xs font-medium text-foreground"
              >
                Notes & Summary <span className="text-destructive">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {summary.length}/5000
              </span>
            </div>
            <Textarea
              id="interaction-summary"
              ref={textareaRef}
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What did you talk about, decide, or need to remember?"
              className={cn(
                "resize-none text-sm leading-relaxed",
                showErrors && !summary.trim()
                  ? "border-destructive ring-1 ring-destructive"
                  : ""
              )}
            />
            {showErrors && !summary.trim() && (
              <p className="mt-1 text-xs text-destructive">
                Please enter a brief note or summary.
              </p>
            )}
          </div>

          {/* 4. Follow-up Date (Optional Presets + Popover) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                Schedule Next Follow-up (Optional)
              </label>
              {followUpDate && (
                <button
                  type="button"
                  onClick={() => setFollowUpDate(null)}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <X className="size-3" /> Clear
                </button>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {[
                { label: "Tomorrow", days: 1 },
                { label: "In 3 days", days: 3 },
                { label: "In 1 week", days: 7 },
              ].map(({ label, days }) => {
                const targetDate = addDays(new Date(), days);
                const isSelected =
                  followUpDate &&
                  format(followUpDate, "yyyy-MM-dd") ===
                    format(targetDate, "yyyy-MM-dd");

                return (
                  <Button
                    key={days}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="xs"
                    onClick={() => setFollowUpDate(isSelected ? null : targetDate)}
                    className={cn(
                      "text-xs",
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    {isSelected && <Check className="size-3 mr-1" />}
                    {label}
                  </Button>
                );
              })}

              {/* Custom Date Popover */}
              <Popover
                open={isFollowUpPopoverOpen}
                onOpenChange={setIsFollowUpPopoverOpen}
              >
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant={followUpDate ? "default" : "outline"}
                      size="xs"
                      className="text-xs gap-1"
                    />
                  }
                >
                  <CalendarIcon className="size-3" />
                  {followUpDate
                    ? format(followUpDate, "MMM d, yyyy")
                    : "Custom Date..."}
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0 w-auto">
                  <Calendar
                    mode="single"
                    selected={followUpDate ?? undefined}
                    onSelect={(d) => {
                      if (d) setFollowUpDate(d);
                      setIsFollowUpPopoverOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Footer with Actions & Keybinding Legend */}
        <div className="mt-6 flex items-center justify-between pt-3 border-t border-border">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                ⌘Enter
              </kbd>{" "}
              Save
            </span>
            <span>·</span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                Esc
              </kbd>{" "}
              Cancel
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1.5 min-w-[120px]"
            >
              {isSubmitting ? "Logging..." : "Log Interaction"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
