"use client"
import { LoginForm } from "@/components/auth/login-form"
import { Dashboard } from "@/components/dashboard/dashboard"
import { LandingPage } from "@/components/landing/landing-page"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [showApp, setShowApp] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!showApp && !user) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />
  }

  return <main className="min-h-screen bg-background">{user ? <Dashboard /> : <LoginForm />}</main>
}
