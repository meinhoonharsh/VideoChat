
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");




const log = (...args) => {
    console.log(...args);
}

// Creating Space for Group Video Chat
export default function Space() {
    const [activeSpace, setActiveSpace] = useState(null);
    const [name, setName] = useState("");
    const [myId, setMyId] = useState("");
    const myVideo = useRef(null);
    const [myStream, setMyStream] = useState(null);
    const spaceId = useParams().spaceId;








    useEffect(() => {




        if (localStorage.name) {


            socket.on("me", (id) => {
                setMyId(id);
                log("My ID is: ", id);
            });

            setName(localStorage.name);
            setActiveSpace(true);
        }
    }, []);

    useEffect(() => {
        if (activeSpace && myId) {
            joinSpace();

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setMyStream(stream);

                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                }
            });
        }
    }, [activeSpace, myId]);

    const joinSpace = () => {
        log("joinSpace function called");
        socket.emit("joinSpace", { name, spaceId, id: myId }); // emit joinSpace event to server
        socket.on("joinedSpace", (data) => {
            log("joinedSpace event called");
            log(data);
        })

        socket.on("userJoined", (data) => {
            log("userJoined event called");
            log(data);
        })

        socket.on("userLeft", (data) => {
            log("userLeft");
            log(data);
        })

    }

    return (
        <>
            {!activeSpace ?
                <div className="create-room">
                    <div>
                        <h2>Enter this Space</h2>
                        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <button onClick={() => {
                            localStorage.setItem("name", name);
                            socket.emit("joinSpace", { name: name });
                            joinSpace();
                            setActiveSpace(true);
                        }}>Join</button>
                    </div>
                </div>
                :
                <div>
                    <h2 style={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "white"
                    }}
                    >Space- {spaceId}</h2>
                    {myStream && <video playsInline muted ref={myVideo} autoPlay />}
                </div>
            }

        </>
    )
}
