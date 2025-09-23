import { Outlet } from '@tanstack/react-router'

export default function GameHome() {
  return (
    <>


      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}
