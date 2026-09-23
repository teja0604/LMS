import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/educator/SideBar'
import Navbar from '../../components/educator/Navbar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
    return (
        <div className="text-default min-h-screen bg-[#F7F7F2] flex flex-col justify-between">
            <Navbar />
            <div className='flex flex-1'>
                <SideBar />
                <main className='flex-1 p-4 md:p-8 overflow-auto'>
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Educator