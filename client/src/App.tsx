import { Routes, Route, Link } from "react-router-dom"
import "./App.css"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import TutorProfile from "./pages/TutorProfile"
import Dashboard from "./pages/Dashboard"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            EliteClassroom
          </Link>
          <span className="hidden text-sm text-muted-foreground md:inline">
            Find trusted tutors for one-to-one learning
          </span>
          <div className="ml-auto flex gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
