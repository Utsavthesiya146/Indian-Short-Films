import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Indian Short Films | Discover India. Watch Stories.',
  description: 'The premium OTT platform for Indian short films, independent cinema, and visionary filmmakers across all Indian languages.',
  keywords: ['Indian Short Films', 'Indie Cinema', 'Hindi Short Films', 'Tamil Short Films', 'Telugu Short Films', 'Gujarati Short Films', 'OTT Streaming'],
  openGraph: {
    title: 'Indian Short Films | Discover India. Watch Stories.',
    description: 'Explore handpicked independent short films from visionary Indian directors.',
    siteName: 'Indian Short Films',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Indian Short Films Banner',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-cinema-bg text-gray-100 flex flex-col min-h-screen antialiased selection:bg-cinema-accent selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
