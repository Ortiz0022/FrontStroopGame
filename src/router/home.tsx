import { Outlet } from '@tanstack/react-router'

export default function GameHome() {
  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <h1 className="text-lg font-semibold">Stroop Game</h1>
          <p className="text-xs text-gray-500">Bienvenido al juego Stroop.</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}
