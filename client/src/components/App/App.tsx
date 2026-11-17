import "./App.css"
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../AppLayout/AppLayout";
import Intro from "../../pages/Intro/Intro";
import Chat from "../../pages/Chat/Chat";
import Register from "../../pages/Register/Register";
import Login from "../../pages/Login/Login";
import { PublicRoute, ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";

function App() {
  return (
   <Routes>
    <Route
      path="/"
      element={<Intro />}
            />
<Route element={<PublicRoute />}>
      <Route 
      path='/login'
       element={<Login />} 
       /> 
<Route 
path='/register' 
element={<Register />} 
/>
</Route>
<Route element={<ProtectedRoute />}>
     <Route element={<AppLayout />}>
       <Route
      path="knowledge"
      element={<KnowledgeBase />}
            />
        <Route
      path="chat"
      element={<Chat />}
            />
     </Route>
     </Route>
   </Routes>
 );
}

export default App;