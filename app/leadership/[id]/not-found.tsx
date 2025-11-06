// app/leadership/[id]/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Profile not found</h1>
        <p className="text-neutral-600">
          The leader you are looking for does not exist or the page has moved.
        </p>
        <Link
          href="/leadership"
          className="inline-block mt-2 px-4 py-2 rounded-md bg-dam-red text-white"
        >
          Back to leadership
        </Link>
      </div>
    </main>
  )
}
