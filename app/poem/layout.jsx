import Sidebar from '@/components/Sidebar';

export default function PoemLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="w-full p-4 md:p-6 transition-all duration-300 md:ml-0 ml-0">
        {children}
      </main>
    </div>
  );
}
