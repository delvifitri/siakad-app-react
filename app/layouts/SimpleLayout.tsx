import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface SimpleLayoutProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function SimpleLayout({ title, children, footer }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 " style={{ backgroundImage: 'url("/bg simple.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-gray-200 ">
        <button onClick={() => window.history.back()} className="text-sm font-medium text-blue-600 ">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="w-8" />
      </header>

      <main className={`flex-1 p-4 ${footer ? 'pb-20' : ''}`}>
        {children}
      </main>

      {footer && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-md border-t border-gray-200 ">
          {footer}
        </footer>
      )}
    </div>
  );
}