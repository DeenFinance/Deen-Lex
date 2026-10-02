import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deen Lex - Legal Case Search',
  description: 'Intelligent Search for Nigerian and English Case Law',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
