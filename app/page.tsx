"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Search, Bell, MessageSquare, Bookmark, User, MoreHorizontal, Heart, Repeat2, Share } from "lucide-react"

export default function Component() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">X</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-xl py-3 h-auto ${activeTab === "home" ? "bg-gray-900" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="mr-4 h-6 w-6" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <Search className="mr-4 h-6 w-6" />
            Explore
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <Bell className="mr-4 h-6 w-6" />
            Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <MessageSquare className="mr-4 h-6 w-6" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <Bookmark className="mr-4 h-6 w-6" />
            Bookmarks
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <User className="mr-4 h-6 w-6" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xl py-3 h-auto">
            <MoreHorizontal className="mr-4 h-6 w-6" />
            More
          </Button>
        </nav>

        {/* Post Button */}
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full mb-4">
          Post
        </Button>

        {/* User Profile */}
        <div className="flex items-center justify-between p-3 rounded-full hover:bg-gray-900 cursor-pointer">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-bold">John Doe</div>
              <div className="text-gray-500 text-sm">@johndoe</div>
            </div>
          </div>
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl border-r border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Tweet Composer */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="What's happening?"
                className="bg-transparent border-none text-xl placeholder-gray-500 p-0 focus-visible:ring-0"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 text-blue-500">{/* Tweet options would go here */}</div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 rounded-full">Post</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="divide-y divide-gray-800">
          {/* Tweet 1 */}
          <div className="p-4 hover:bg-gray-950/50 cursor-pointer">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Sarah Anderson</span>
                  <span className="text-gray-500">@sarahdev</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">2h</span>
                </div>
                <p className="mt-1">
                  Just shipped a new feature! The team worked incredibly hard on this one. Excited to see how users
                  respond to the new dashboard design 🚀
                </p>
                <div className="flex items-center justify-between mt-3 max-w-md">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    12
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-green-500 hover:bg-green-500/10"
                  >
                    <Repeat2 className="h-5 w-5 mr-2" />8
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-500/10">
                    <Heart className="h-5 w-5 mr-2" />
                    24
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tweet 2 */}
          <div className="p-4 hover:bg-gray-950/50 cursor-pointer">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Mike Johnson</span>
                  <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                    Verified
                  </Badge>
                  <span className="text-gray-500">@mikej</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">4h</span>
                </div>
                <p className="mt-1">
                  The future of web development is looking bright! AI-powered tools are making developers more
                  productive than ever.
                </p>
                <div className="flex items-center justify-between mt-3 max-w-md">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    45
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-green-500 hover:bg-green-500/10"
                  >
                    <Repeat2 className="h-5 w-5 mr-2" />
                    32
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-500/10">
                    <Heart className="h-5 w-5 mr-2" />
                    128
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tweet 3 */}
          <div className="p-4 hover:bg-gray-950/50 cursor-pointer">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>EL</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Emily Liu</span>
                  <span className="text-gray-500">@emilydesign</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">6h</span>
                </div>
                <p className="mt-1">
                  Working on some exciting UI concepts today. The intersection of design and technology never ceases to
                  amaze me ✨
                </p>
                <div className="flex items-center justify-between mt-3 max-w-md">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    18
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-green-500 hover:bg-green-500/10"
                  >
                    <Repeat2 className="h-5 w-5 mr-2" />
                    15
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-500/10">
                    <Heart className="h-5 w-5 mr-2" />
                    67
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500 hover:bg-blue-500/10">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input placeholder="Search" className="bg-gray-900 border-gray-800 pl-12 rounded-full" />
        </div>

        {/* Trending */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">What's happening</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
              <p className="text-gray-500 text-sm">Trending in Technology</p>
              <p className="font-bold">Next.js 15</p>
              <p className="text-gray-500 text-sm">42.1K posts</p>
            </div>
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
              <p className="text-gray-500 text-sm">Trending</p>
              <p className="font-bold">AI Development</p>
              <p className="text-gray-500 text-sm">28.5K posts</p>
            </div>
            <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
              <p className="text-gray-500 text-sm">Technology · Trending</p>
              <p className="font-bold">React 19</p>
              <p className="text-gray-500 text-sm">15.2K posts</p>
            </div>
          </CardContent>
        </Card>

        {/* Who to follow */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Who to follow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>VT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">Vercel</p>
                  <p className="text-gray-500 text-sm">@vercel</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
                Follow
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>NT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">Next.js</p>
                  <p className="text-gray-500 text-sm">@nextjs</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
                Follow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
