// Import React routing components
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import VideoChat from "./pages/VideoChat";

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="videochat" element={<VideoChat />} />
      </Routes>
    </BrowserRouter>
  </>
}
export default App;
