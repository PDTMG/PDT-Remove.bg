import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Menubar from "./components/MenuBar";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import UserSyncHandler from "./components/UserSyncHandler";


const App = () => {
  return (
    <div>
      <UserSyncHandler />
      <Menubar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  )
}
export default App;