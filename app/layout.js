import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono', display: 'swap' });

export const metadata = {
  title: 'StadiumIQ | FIFA World Cup 2026',
  description: 'The High-Performance AI Stadium Intelligence Platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen overflow-x-hidden font-sans bg-white text-black">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
