import './globals.css';
// import { Navbar } from '@/components/Navbar';
// import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'E-Commerce Store',
  description: 'Shop your favorite products online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* <Navbar /> */}
        <main className="min-h-screen container mx-auto p-4">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
