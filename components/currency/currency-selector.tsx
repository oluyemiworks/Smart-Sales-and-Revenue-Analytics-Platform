"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, DollarSign } from "lucide-react"
import { SUPPORTED_CURRENCIES, getUserCurrency, setUserCurrency, type Currency } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void
}

export function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(getUserCurrency())
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setSelectedCurrency(getUserCurrency())
  }, [])

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode)
    if (currency) {
      setSelectedCurrency(currency)
      setUserCurrency(currency)
      onCurrencyChange?.(currency)

      toast({
        title: "Currency Updated",
        description: `Currency changed to ${currency.name} (${currency.symbol})`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <DollarSign className="h-4 w-4" />
          {selectedCurrency.code}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Currency Settings
          </DialogTitle>
          <DialogDescription>Choose your preferred currency for all price displays</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Currency</CardTitle>
            <CardDescription>
              This will update all prices, costs, and revenue displays throughout the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-muted-foreground">({currency.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Preview:</strong> Sample price will display as{" "}
                <span className="font-mono font-bold">
                  {selectedCurrency.position === "before"
                    ? `${selectedCurrency.symbol}99.99`
                    : `99.99${selectedCurrency.symbol}`}
                </span>
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(false)}>Done</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
