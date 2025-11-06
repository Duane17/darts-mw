// app/leadership/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="animate-pulse text-center space-y-2">
        <div className="h-8 w-40 bg-neutral-200 rounded mx-auto" />
        <div className="h-4 w-64 bg-neutral-200 rounded mx-auto" />
      </div>
    </div>
  )
}
