import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

/**
 * ChatContainer Component
 * 
 * We now have two types of state here:
 * 1. messages: An array of all our chat bubbles.
 * 2. inputText: Whatever the user is currently typing.
 */
const ChatContainer = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am VisionChat AI. How can I help you today?", sender: "ai" }
  ])
  const [inputText, setInputText] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  /**
   * WHAT IS useRef?
   * Think of it like a "hook" or a "pointer" to a real HTML element on the page.
   * We need this to tell the browser: "Hey, scroll *this* specific div!"
   */
  const messagesEndRef = useRef(null)

  /**
   * WHAT IS useEffect?
   * This is how React handles "Side Effects" — things that happen *outside* 
   * of just rendering HTML (like scrolling, fetching data, or timers).
   * 
   * This effect runs every time the 'messages' array changes.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * HANDLING IMAGES
   * This is how we take a file from your computer and "read" it 
   * so we can show a preview and eventually send it to the AI.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result) // This is a "Base64" string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      text: inputText,
      image: selectedImage,
      sender: "user"
    }
    setMessages(prev => [...prev, userMsg])

    // Save current values and reset input
    const currentText = inputText;
    const currentImage = selectedImage;
    setInputText("")
    setSelectedImage(null)
    setIsLoading(true)

    // 2. Real AI Response using AXIOS
    try {
      /**
       * WHY AXIOS?
       * 1. Automatic JSON: Unlike fetch(), axios converts data to JSON automatically.
       * 2. Error Handling: Axios throws an error for all 4xx and 5xx status codes.
       * 3. Cleaner Syntax: No need for .json() step.
       */
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/chat`, {
        text: currentText,
        image: currentImage
      });

      const aiMsg = {
        id: Date.now() + 1,
        text: response.data.text,
        sender: "ai"
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Axios Error:', error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Error: ${errorMessage}. Is the server running on port 5001?`,
        sender: "ai"
      }]);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-14rem)] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl border ${msg.sender === 'user'
              ? 'bg-cyan-500 text-black border-cyan-400 font-medium'
              : 'bg-white/10 border-white/10 text-gray-200'
              } shadow-lg space-y-2`}>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded content"
                  className="max-h-60 rounded-xl object-cover border border-white/10"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="max-w-[80%] p-4 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
              <span className="text-sm font-medium ml-2">Gemini is thinking...</span>
            </div>
          </div>
        )}

        {/* This empty div is our "Anchor". We scroll to this point! */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">

        {/* Image Preview Area */}
        {selectedImage && (
          <div className="mb-4 relative inline-block animate-in slide-in-from-bottom-2 duration-300">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-2xl border-2 border-cyan-500/50 p-1 bg-white/5 shadow-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-slate-900 cursor-pointer hover:bg-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <div className="relative flex items-center gap-3">
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer ${selectedImage ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-gray-500 text-white"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`px-6 py-4 bg-cyan-500 text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-3 text-center uppercase tracking-widest font-semibold">
          Powered by Gemini 2.0 Flash
        </p>
      </div>
    </div>
  )
}

export default ChatContainer
