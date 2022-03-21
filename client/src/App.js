import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.scss";

// const socket = io.connect("http://localhost:8000");
const socket = io.connect("https://videochat.meinhoonharsh.repl.co/");

function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Prompting to Ask for Permission
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
      console.log(id);
    });

    socket.on("callUser", (data) => {
      setCaller(data.from);
      setCallerSignal(data.signal);
      setReceivingCall(true);
      setName(data.name);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        signalData: data,
        to: id,
        from: me,
        name: name
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signalData: data,
        to: caller
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    setCallAccepted(true);
    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  return (
    <>
      <div className="video-app">
        <h1 className="header">vDeo Chat- Test01</h1>
        <div className="container">
          <div className="video-container">
            <div className="video">
              {stream && <video playsInline muted ref={myVideo} autoPlay />}
            </div>
            {callAccepted && !callEnded ? (
              <div className="video">
                <video playsInline ref={userVideo} autoPlay />
              </div>
            ) : null}
          </div>
          <div className="tools">
            <div>
              <input
                type="text"
                id="filled-basic"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                Your ID: {me} &nbsp;
                <CopyToClipboard text={me}>
                  <button className="ctc button"><i className="fa fa-copy" /></button>
                </CopyToClipboard>
              </div>
            </div>
            <div>
              <input
                type="text"
                id="filled-basic"
                placeholder="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <button className="button" onClick={endCall} >
                    End Call
                  </button>
                ) : (
                  <button className="button" onClick={() => callUser(idToCall)} >
                    <i className="fa fa-phone" /> Call
                  </button>
                )}
                &nbsp;{idToCall}
              </div>
            </div>
          </div>
          <div>
            {receivingCall && !callAccepted ? (
              <div className="caller">
                <h1>{name} is calling...</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={answerCall}
                >
                  Answer
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
