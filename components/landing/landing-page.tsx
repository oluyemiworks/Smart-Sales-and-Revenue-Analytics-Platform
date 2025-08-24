"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Package, TrendingUp, FileText, Globe, Shield, Zap, Users } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">SmartSales</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/20 to-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Transform Your Business Today</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Smart Sales & Revenue
            <span className="text-primary block">Analytics</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Empower your small business with comprehensive inventory management, sales tracking, and revenue insights.
            Make data-driven decisions with multi-currency support and professional reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              Start Free Trial
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Grow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for small business owners who want to scale efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Inventory Management</CardTitle>
                <CardDescription>
                  Track products, costs, selling prices, and stock levels with automated low-stock alerts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-foreground">Sales Tracking</CardTitle>
                <CardDescription>
                  Record daily sales, calculate profits automatically, and monitor revenue trends over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-foreground">Revenue Analytics</CardTitle>
                <CardDescription>
                  Interactive charts and insights to understand your business performance and growth patterns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Professional Reports</CardTitle>
                <CardDescription>
                  Export detailed reports in PDF, CSV, and JSON formats for accounting and business analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-foreground">Multi-Currency Support</CardTitle>
                <CardDescription>
                  Support for 10+ currencies including USD, EUR, GBP, NGN, and more with real-time formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-foreground">Secure & Private</CardTitle>
                <CardDescription>
                  Your business data stays secure with local storage and no external data sharing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Small Businesses Choose SmartSales
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Quick Setup</h3>
                    <p className="text-muted-foreground">
                      Get started in minutes, not hours. No complex configurations or technical expertise required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Grow Revenue</h3>
                    <p className="text-muted-foreground">
                      Make informed decisions with real-time insights that help you identify profitable products and
                      trends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Built for Small Business</h3>
                    <p className="text-muted-foreground">
                      Designed specifically for small business needs without the complexity of enterprise solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <p className="text-muted-foreground mb-6">
                  of small businesses see improved profitability within 30 days
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">24/7</div>
                    <p className="text-sm text-muted-foreground">Access Anywhere</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">10+</div>
                    <p className="text-sm text-muted-foreground">Currencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Small Business Owners</h2>
          <p className="text-xl text-muted-foreground mb-12">
            See how SmartSales is helping businesses grow and succeed.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 italic">
                  "SmartSales transformed how I track my inventory and sales. The multi-currency support is perfect for
                  my international customers."
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">SA</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Sarah Ahmed</p>
                    <p className="text-sm text-muted-foreground">Boutique Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 italic">
                  "The analytics dashboard gives me insights I never had before. I can finally see which products are
                  most profitable."
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-secondary font-semibold">MJ</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Michael Johnson</p>
                    <p className="text-sm text-muted-foreground">Electronics Store</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of small business owners who are already growing with SmartSales.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg"
          >
            Start Your Free Trial
            <TrendingUp className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">No credit card required • Setup in under 5 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">SmartSales</span>
              </div>
              <p className="text-primary-foreground/80">
                Empowering small businesses with smart analytics and insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#features" className="hover:text-primary-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 SmartSales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
