import { Outlet } from 'react-router-dom'
import {Header} from "@/components/Header.tsx";
import {Sidebar} from "@/components/Sidebar.tsx";


export const RootLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
