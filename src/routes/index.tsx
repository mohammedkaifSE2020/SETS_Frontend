import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../componentss/layout/MainLayout';
import HomePage from '../pages/Homepage';
import RegistrationPage from '../pages/RegistrationPage';
import PublicRoutes from './publicRoutes';
import NotFoundPage from '../pages/NotFoundPage';
import CreateRoomPage from '../pages/CreateRoomPage';
import ProtectedRoutes from './protectedRoutes';
import BrowseRoomsPage from '../pages/BrowseRoomsPage';
import RoomPage from '../pages/RoomPage';
import GameBoardPage from '../pages/GameBoardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      // PUBLIC ROUTES (Only for non-authenticated users)
      {
        element: <PublicRoutes />,
        children: [
          {
            path: 'register',
            element: <RegistrationPage />,
          },
        ],
      },

      // PROTECTED ROUTES (Only for authenticated users)
      {
        element: <ProtectedRoutes />,
        children: [
          // {
          //   path: 'lobby',
          //   element: <LobbyPage />,
          // },
          {
            path: 'create-room',
            element: <CreateRoomPage />,
          },
          {
            path: 'browse-rooms',
            element: <BrowseRoomsPage />,
          },
          {
            path: 'room/:roomCode',
            element: <RoomPage />,
          },
          {
            path: 'game/:roomCode',
            element: <GameBoardPage />,
          }
          // {
          //   path: 'profile',
          //   element: <ProfilePage />,
          // },
        ],
      },

      // 404 - No wrapper needed
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);