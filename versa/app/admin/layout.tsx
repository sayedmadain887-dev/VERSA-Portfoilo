import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display'
});
const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body'
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'VERSA Admin',
  description: 'Private control panel'
};

// The admin area lives outside the [locale] segment (it isn't part of the
// bilingual public site), so it needs its own <html>/<body> - the root
// app/layout.tsx is a passthrough for next-intl routing and doesn't provide them.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased admin-scope`}>
        {children}
      </body>
    </html>
  );
}
