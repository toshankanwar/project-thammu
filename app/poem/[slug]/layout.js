// app/poem/[slug]/layout.js (Server Component)
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'poems'));
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// Server-side rendering layout component
export default function PoemLayout({ children }) {
  return <>{children}</>;
}
