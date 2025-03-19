"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, ArrowLeft, Loader2, ThumbsUp, ThumbsDown, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isLoading?: boolean
}

type QuickReply = {
  id: string
  text: string
}

export default function MedbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! I'm MedBot, your medical assistant. I can help you find the right doctor based on your symptoms or health concerns. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickReplies: QuickReply[] = [
    { id: "q1", text: "I have a headache" },
    { id: "q2", text: "Stomach pain" },
    { id: "q3", text: "Skin rash" },
    { id: "q4", text: "Joint pain" },
    { id: "q5", text: "Feeling anxious" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add loading message
    const loadingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        content: "",
        sender: "bot",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    // Simulate bot response after delay
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingId)
          .concat({
            id: (Date.now() + 2).toString(),
            content: getBotResponse(input),
            sender: "bot",
            timestamp: new Date(),
          }),
      )
    }, 1500)
  }

  const handleQuickReply = (text: string) => {
    setInput(text)
    handleSend()
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("headache") || input.includes("migraine")) {
      return "Headaches can have many causes. Based on your symptoms, you might want to consult with a neurologist. Would you like me to find neurologists in your area?"
    } else if (input.includes("stomach") || input.includes("abdomen") || input.includes("digestive")) {
      return "For stomach or digestive issues, a gastroenterologist would be the appropriate specialist. I can help you find one nearby. Would you like to see available gastroenterologists?"
    } else if (input.includes("skin") || input.includes("rash")) {
      return "Skin conditions are best evaluated by a dermatologist. I can show you dermatologists with availability this week. Would that be helpful?"
    } else if (input.includes("joint") || input.includes("arthritis") || input.includes("pain")) {
      return "Joint pain could be addressed by an orthopedic specialist or rheumatologist depending on the cause. Can you tell me more about your symptoms so I can recommend the right specialist?"
    } else if (input.includes("anxiety") || input.includes("depression") || input.includes("mental")) {
      return "For mental health concerns, I recommend speaking with a psychiatrist or psychologist. Would you like me to find mental health professionals in your area?"
    } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! I'm here to help you find the right medical specialist. Could you describe your symptoms or health concerns?"
    } else {
      return "Thank you for sharing that information. To better assist you in finding the right specialist, could you provide more details about your symptoms? For example, how long have you been experiencing them, and are there any other symptoms?"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container max-w-6xl mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="MedBot" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">MedBot Assistant</p>
              <p className="text-xs text-muted-foreground">Medical AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        <div className="container max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="MedBot" />
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] md:max-w-[70%] ${message.sender === "user" ? "order-1" : "order-2"}`}>
                <Card className={`${message.sender === "user" ? "bg-black text-white" : "bg-white"} shadow-sm`}>
                  <CardContent className="p-4">
                    {message.isLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm md:text-base">{message.content}</p>
                        {message.sender === "bot" && (
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 ml-2 mt-1">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {messages.length < 3 && (
        <div className="bg-white border-t p-3">
          <div className="container max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <Button
                  key={reply.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  className="rounded-full"
                >
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your symptoms or health concerns..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={input.trim() === ""}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            MedBot provides general guidance only. Always consult with a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

