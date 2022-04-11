import React, { useEffect, useState } from 'react'
import './Home.scss'

export default function Home() {
    const [name, setName] = useState('')
    const [spaceId, setSpaceId] = useState('')
    return (
        <div className='create-room'>
            <div>
                <h2>Create Your Space</h2>
                <input type="text" placeholder="Space Name/Id" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Your Name" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} />
                <button >Create</button>
            </div>
        </div>
    )
}
