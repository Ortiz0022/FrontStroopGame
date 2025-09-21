import {
  Router,
  RootRoute,
  Route,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect } from 'react'

import GameHome from './Home'
import LoginPage from '../pages/LoginPage'
import LobbyPage from '../pages/LobbyPage'
import WaitingRoomPage from '../pages/WaitingRoomPage'
import GamePage from '../pages/GamePage'
import RankingPage from '../pages/RakingPage'

// NotFound -> redirige a /game/login
function RedirectToLogin() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate({ to: '/game/login', replace: true })
  }, [navigate])
  return null
}

// Root simple con NotFound moderno
const rootRoute = new RootRoute({
  component: () => <Outlet />,
  notFoundComponent: RedirectToLogin,
})

// Layout /game
const gameLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GameHome,
})

// /game (index) -> Login
const gameIndexRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/', // index
  component: LoginPage,
})

// /game/login
const loginRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/login',
  component: LoginPage,
})

// /game/lobby
const lobbyRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/lobby',
  component: LobbyPage,
})

// /game/room/:roomCode/wait
const roomWaitRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/room/$roomCode/wait',
  component: WaitingRoomPage,
})

// /game/room/:roomCode/play
const roomGameRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/room/$roomCode/play',
  component: GamePage,
})

// /game/ranking
const rankingRoute = new Route({
  getParentRoute: () => gameLayoutRoute,
  path: '/ranking',
  component: RankingPage,
})

// Ensamble árbol
const routeTree = rootRoute.addChildren([
  gameLayoutRoute.addChildren([
    gameIndexRoute,
    loginRoute,
    lobbyRoute,
    roomWaitRoute,
    roomGameRoute,
    rankingRoute,
  ]),
])

export const gameRouter = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof gameRouter
  }
}
