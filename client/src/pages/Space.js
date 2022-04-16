
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
    const [stream, setStream] = useState(null);
    const spaceId = useParams().spaceId;

    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);





    const createPeer = (userToSignal, myId, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socket.emit("sendSignal", { to: userToSignal, id: myId, signal: data, name });
        });


        return peer;
    };


    const addPeer = (incomingSignal, userId, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socket.emit("signalAccepted", { to: userId, id: myId, signal: data, name });
        });



        peer.signal(incomingSignal);

        return peer;
    };


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
        log("Peers: ", peers)
    }, [peers])

    useEffect(() => {
        if (activeSpace && myId) {

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setStream(stream);

                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                }
            });

            joinSpace();
        }
    }, [activeSpace, myId]);

    const joinSpace = () => {
        log("I am joining the space");
        socket.emit("joinSpace", { name, spaceId, id: myId }); // emit joinSpace event to server
        socket.on("joinedSpace", (data) => {
            log("joinedSpace event called");
            log(data);
        })

        socket.on("userJoined", (data) => {
            log("Someone joined the room");
            log(data);
        })

        socket.on("users", (users) => {
            const peers = [];
            users.forEach(user => {
                if (user !== myId) {
                    log("I am creating peer for user: ", user);
                    const peer = createPeer(user, myId, stream);
                    peersRef.current.push({ peer, userId: user });
                    peers.push(peer);
                }
            });
            setPeers(peers);
        })

        socket.on("usercalling", (data) => {
            log("Someone is calling you to create Peer : ", data);

            const peer = addPeer(data.signal, data.id, stream);
            peersRef.current.push({ peer, userId: data.id });
            setPeers([...peers, peer]);



        });


        socket.on("signalAccepted", (data) => {

            log("Other Peer has Accepted the call");

            const item = peersRef.current.find(p => p.userId === data.id);
            if (item) {
                item.peer.signal(data.signal);
            }
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
                    {stream && <Video vidref={myVideo} muted={true} />}

                    {peers.map((peer, index) => {
                        return <PeerVideo key={index} peer={peer} name={name} />
                    })}
                </div>
            }

        </>
    )
}



const PeerVideo = ({ peer, name }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (peer && videoRef.current) {
            peer.on("stream", stream => {
                videoRef.current.srcObject = stream;
            });
        }
    }, []);
    return (
        <Video vidref={videoRef} />
    )

}

const Video = ({ vidref, muted = false }) => {
    return (
        <video playsInline autoPlay ref={vidref} muted={muted} />
    )
}
