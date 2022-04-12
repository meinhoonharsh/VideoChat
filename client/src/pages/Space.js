
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
    const myId = useRef(null);

    const spaceId = useParams().spaceId;
    log("Space Id: ", spaceId);



    useEffect(() => {

        socket.on("me", (id) => {
            myId.current = id;
            log("My ID is: ", id);
        });


        if (localStorage.name) {
            setName(localStorage.name);
            setActiveSpace(true);
        }
    }, []);

    useEffect(() => {
        if (activeSpace) {
            joinSpace();
        }
    }, [activeSpace]);

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
                <div>Video Chat Space</div>
            }

        </>
    )
}
