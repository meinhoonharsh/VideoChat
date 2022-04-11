
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");

export default function Space() {
    const [stream, setStream] = useState();

    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            // setStream(stream);
            // if (myVideo.current) {
            //     myVideo.current.srcObject = stream;
            // }
        });

    socket.on("someonecalling", (data) => {
        console.log("someonecalling", data);

    })

    const createPeer = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            console.log("signal", data);
            socket.emit("callsomeone", {
                signal: data,
            });
        });

        peer.on("stream", (stream) => {
            console.log("peer-on - stream", stream);
        });

    }

    return (
        <>
            <div>Room</div>
            <button onClick={createPeer}> Create Peer</button>
        </>
    )
}
