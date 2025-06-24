"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
      
      {/* Círculos animados */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}} />
      
      {/* Partículas flotantes */}
      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-blue-500/30 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
      <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-purple-500/40 rounded-full animate-bounce" style={{animationDelay: '3s'}} />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-indigo-500/35 rounded-full animate-bounce" style={{animationDelay: '5s'}} />
      
      {/* Líneas de conexión sutiles */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgb(147 51 234)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" />
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="url(#lineGradient)" strokeWidth="0.5" />
      </svg>
    </div>
  )
} 