import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '../firebase/firebaseAuthContext';
import Head from 'next/head'; // Import Head from Next.js

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>PoemSite</title> {/* Add the title here */}
        <meta name="description" content="A beautiful poetry collection." /> 
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-xxxx"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />{/* Add description meta tag */}
      </Head>
 
      <body className="bg-white text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
