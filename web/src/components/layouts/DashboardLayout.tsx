import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export default function DashboardLayout() {
    return (
      
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

            <Sidebar role="superadmin" />

            <div className="flex-1 flex flex-col border-l border-lines">

                <Header role="superadmin" />

                <main className="p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}