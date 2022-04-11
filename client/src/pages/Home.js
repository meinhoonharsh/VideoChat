import React from 'react'
import './Home.scss'

export default function Home() {
    return (
        <div className='create-room'>
            <div>
                <h2>Create Your Space</h2>
                <input type="text" placeholder="Space Name/Id" />
                <input type="text" placeholder="Your Name" />
                <button>Create</button>
            </div>
        </div>
    )
}
