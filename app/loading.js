export default function Loading() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-white"
      role="status"
      aria-label="Loading StadiumIQ"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Loading StadiumIQ...
        </span>
      </div>
    </div>
  );
}
