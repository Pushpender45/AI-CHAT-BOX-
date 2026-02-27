import React, { useState } from 'react'
import Navbar from './components/Navbar'
import ChatContainer from './components/ChatContainer'

/**
 * WHAT IS STATE?
 * State is how React "remembers" things. 
 * 'isChatting' is a variable that can be true or false.
 * 'setIsChatting' is the function we use to change it.
 */
function App() {
  const [isChatting, setIsChatting] = useState(false)

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans antialiased">
      {/* Background Glows for Premium Aesthetic (Aurora Effects) */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      {/* Passing a function as a 'Prop' so Navbar can change App's state! */}
      <Navbar onLogoClick={() => setIsChatting(false)} />

      <main className="max-w-7xl mx-auto pt-32 px-6">
        {/* CONDITIONAL RENDERING
            If isChatting is false, show the Hero section.
            If isChatting is true, show the ChatContainer.
        */}
        {!isChatting ? (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Next Gen Vision Engine
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
              SEE BEYOND <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                CONVERSATION
              </span>
            </h1>

            <p className="text-gray-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
              Experience the next generation of multimodal interaction.
              Upload images, analyze data, and build with intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Triggering State Change on Click */}
              <button
                onClick={() => setIsChatting(true)}
                className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-2xl shadow-cyan-500/40 active:scale-95 cursor-pointer text-lg"
              >
                Start Chatting
              </button>
              <button className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 font-bold rounded-2xl transition-all active:scale-95 cursor-pointer text-lg">
                Read Documentation
              </button>
            </div>
          </div>
        ) : (
          <ChatContainer />
        )}
      </main>
    </div>
  )
}

export default App
