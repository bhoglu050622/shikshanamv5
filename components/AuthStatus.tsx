'use client'

import { useSession } from 'next-auth/react'

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Loading authentication...
      </div>
    )
  }

  if (session) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Logged in as: {session.user?.name} ({session.user?.email})
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
      Not logged in
    </div>
  )
}
