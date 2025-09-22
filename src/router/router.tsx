import {
    Router,
    RootRoute,
    Route,
    Outlet,
    useNavigate,
  } from '@tanstack/react-router'
  import { useEffect } from 'react'
  
  // Layout
  import GameHome from './home'
  import LobbyPage from '../pages/LobbyPage'
  import LoginPage from '../pages/LoginPage'
  import WaitingRoomPage from '../pages/WaitingRoomPage'
  import GamePage from '../pages/GamePage'
  
  // Redirige cualquier ruta desconocida hacia /game/register
  function RedirectToRegister() {
    const navigate = useNavigate()
    useEffect(() => {
      navigate({ to: '/game/login', replace: true })
    }, [navigate])
    return null
  }
  
  // Root simple con NotFound moderno
  const rootRoute = new RootRoute({
    component: () => <Outlet />,
    notFoundComponent: RedirectToRegister,
  })
  
  // Layout /game
  const gameLayoutRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/game',
    component: GameHome,
  })
  
  // /game (index) -> RegisterPage (login)
  const gameIndexRoute = new Route({
    getParentRoute: () => gameLayoutRoute,
    path: '/', // index
    component: LoginPage,
  })
  
  // /game/register (login)
  const registerRoute = new Route({
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
  
  // // 🔑 WaitingRoom route paramétrica
  // const roomWaitRoute = new Route({
  //   getParentRoute: () => gameLayoutRoute,
  //   path: '/room/$roomCode/wait',
  //   component: WaitingRoomPage,
  // })
  
  const roomGameRoute = new Route({
    getParentRoute: () => gameLayoutRoute,
    path: '/room/${roomCode}/game',
    component: GamePage,
  })
  
  // Ensamble del árbol
  const routeTree = rootRoute.addChildren([
    gameLayoutRoute.addChildren([
      gameIndexRoute,
      registerRoute,
      lobbyRoute,
      // roomWaitRoute,
      roomGameRoute,
    ]),
  ])
  
  export const gameRouter = new Router({ routeTree })
  
  declare module '@tanstack/react-router' {
    interface Register {
      router: typeof gameRouter
    }
  }
  