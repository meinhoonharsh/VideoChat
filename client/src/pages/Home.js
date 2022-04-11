import React, { useEffect, useState } from 'react'
import './Home.scss'
import { Link } from 'react-router-dom'

export default function Home() {
    const [name, setName] = useState('')
    const [spaceId, setSpaceId] = useState('')
    const [link, setLink] = useState('')
    const createSpace = () => {
        localStorage.setItem('name', name)
        var dummyLink = '/space/' + spaceId
        setLink(dummyLink)
    }

    useEffect(() => {
        if (localStorage.getItem('name')) {
            setName(localStorage.getItem('name'))
        }
    }, [])

    return (
        <div className='create-room'>
            <div>
                <h2>Create Your Space</h2>
                <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Space Name/Id" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} />
                <button onClick={createSpace}>Create</button>
                {link &&
                    <p>
                        To join your Space <Link to={link}>Click here</Link>
                    </p>
                }
            </div>
        </div>
    )
}
