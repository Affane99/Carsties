import React from 'react'
import Search from './Search'
import Logo from './Logo'

export default function Navbar() {
    return (
        <header className='sticky top-0 z-50 flex justify-between items-center p-5 bg-white text-gray-800 shadow-md'>
            <Logo />
            <Search />
            <div>Login</div>
        </header>
    )
}
