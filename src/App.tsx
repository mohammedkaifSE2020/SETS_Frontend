import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { WebSocketManager } from './componentss/common/WebSocketManager';

function App() {
 
    return (
    <>
      <WebSocketManager/>
      <RouterProvider router={router} />
    </>
  )
}

export default App
