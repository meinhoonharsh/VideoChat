import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect("http://localhost:8000")

function App() {
  return (
    <div className="App">
      Jai Hind Dosto....
    </div>
  );
}

export default App;
