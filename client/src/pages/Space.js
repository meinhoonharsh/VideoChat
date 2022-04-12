
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");

export default function Space() {
    const [name, setName] = useState("");

    const log = (...args) => {
        console.log(...args);
    }

    useEffect(() => {
        if (localStorage.name) {
            setName(localStorage.name);
            joinSpace();
        }
    }, []);

    const joinSpace = () => {
        log("joinSpace function called");
    }

    return (
        <>
            {!name &&
                <div className="create-room">
                    <div>
                        <h2>Enter this Space</h2>
                        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <button onClick={() => {
                            localStorage.setItem("name", name);
                            socket.emit("joinSpace", { name: name });
                            joinSpace();
                        }}>Join</button>
                    </div>
                </div>
            }


            {name &&
                <div>Video Chat Space</div>
            }

        </>
    )
}
