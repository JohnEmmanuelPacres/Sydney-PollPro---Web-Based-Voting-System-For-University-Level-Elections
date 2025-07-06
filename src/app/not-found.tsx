// app/not-found.tsx
import { Suspense } from 'react'

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}

function NotFoundContent() {
  // Now you can safely use useSearchParams here
  // const searchParams = useSearchParams()
  
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}