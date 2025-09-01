'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function ThemeDemoPage() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-bg-primary theme-transition">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text-primary mb-2">
                Theme System Demo
              </h1>
              <p className="text-text-secondary text-lg">
                Showcasing the culturally relevant light and dark themes
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Color Palette */}
          <Card variant="sacred">
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>
                Culturally relevant colors for both light and dark themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-text-primary">Background Colors</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-bg-primary border border-border-primary rounded"></div>
                      <span className="text-sm text-text-secondary">bg-primary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-bg-secondary border border-border-primary rounded"></div>
                      <span className="text-sm text-text-secondary">bg-secondary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-bg-tertiary border border-border-primary rounded"></div>
                      <span className="text-sm text-text-secondary">bg-tertiary</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-text-primary">Accent Colors</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-accent-primary rounded"></div>
                      <span className="text-sm text-text-secondary">accent-primary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-accent-secondary rounded"></div>
                      <span className="text-sm text-text-secondary">accent-secondary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-accent-tertiary rounded"></div>
                      <span className="text-sm text-text-secondary">accent-tertiary</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Text colors and styles that adapt to the theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-text-primary">Primary Text</h1>
                <p className="text-text-secondary">Secondary text for descriptions and captions</p>
                <p className="text-accent-primary font-medium">Accent text for highlights and links</p>
                <p className="text-accent-secondary">Secondary accent for subtle emphasis</p>
              </div>
              <div className="pt-4 border-t border-border-primary">
                <h3 className="font-semibold text-text-primary mb-2">Sanskrit Typography</h3>
                <p className="sanskrit-text text-lg">ॐ नमः शिवाय</p>
                <p className="sanskrit-heading text-xl">वेदान्त दर्शन</p>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Theme-aware button variants with cultural styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="sacred">Sacred</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Form inputs that adapt to the current theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Default Input
                  </label>
                  <Input 
                    placeholder="Enter your text here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Sacred Input
                  </label>
                  <Input 
                    variant="sacred"
                    placeholder="Sacred input with special styling..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Outline Input
                  </label>
                  <Input 
                    variant="outline"
                    placeholder="Outline variant..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Error Input
                  </label>
                  <Input 
                    error
                    placeholder="Input with error state..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                This card has interactive hover effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Hover over this card to see the interactive effects. The card will lift up and change its border color.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          {/* Cultural Elements */}
          <Card variant="sacred">
            <CardHeader>
              <CardTitle>Cultural Elements</CardTitle>
              <CardDescription>
                Indian/Sanskrit inspired design elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="indian-gradient p-4 rounded-lg text-bg-primary text-center">
                  <p className="font-semibold">Indian Gradient Background</p>
                </div>
                <div className="sacred-pattern p-4 rounded-lg border border-border-primary">
                  <p className="text-text-primary text-center font-medium">Sacred Pattern Background</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center sacred-rotate">
                    <span className="text-bg-primary font-bold text-xl">ॐ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Theme Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Theme System Features</CardTitle>
              <CardDescription>
                Key features of the culturally relevant theme system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-text-primary">Light Theme</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Soft sandalwood backgrounds</li>
                    <li>• Ivory and warm cream tones</li>
                    <li>• Deep saffron accents</li>
                    <li>• Earthy brown text colors</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-text-primary">Dark Theme</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Deep indigo backgrounds</li>
                    <li>• Muted black tones</li>
                    <li>• Gold and copper accents</li>
                    <li>• Beige and tan text colors</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-text-primary">Accessibility</h4>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• WCAG compliant contrast ratios</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Screen reader friendly</li>
                    <li>• Reduced motion support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
