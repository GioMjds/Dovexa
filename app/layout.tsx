import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { OfflineStatus } from '@/components/pwa/offline-status';
import { RegisterServiceWorker } from '@/components/pwa/register-service-worker';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dovexa',
  description:
    'Dovexa is a modern CRM for managing contacts, tasks, and organizations with ease.',
  applicationName: 'Dovexa',
  // Add more if needed
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Add more if needed
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dovexa',
  url: 'https://dovexa.com',
  // Add more if needed
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          'min-h-dvh',
          jakarta.variable,
          jakarta.className,
          manrope.variable,
          manrope.className,
          'antialiased',
          'font-sans',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OfflineStatus />
          {children}
          <Toaster closeButton richColors position="top-right" />
          <RegisterServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );
}
