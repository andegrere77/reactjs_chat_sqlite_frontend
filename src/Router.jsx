import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatRooms from "./components/ChatRooms";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Error403 from "./components/Error403";
import ProtectedRoute from './components/ProtectedRoute';

function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/403" element={<Error403 />} />
        <Route exact path="/chatrooms" element={<ProtectedRoute element={ChatRooms} />} />
        <Route exact path="/chatroom/:name" element={<ProtectedRoute element={ChatRoom} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
