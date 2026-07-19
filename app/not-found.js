import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-black">Page not found</h1>
        <p className="mt-3 text-sm text-neutral-600">
          The page you’re looking for may have moved or no longer exists.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          Return home
        </Link>
      </div>
    </main>
  );
}
