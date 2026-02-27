"use client";

import { useState } from "react";
import { redirectToDashboard } from "../services/client-side-serivices/client-redirections";
import { ArrowRight, Lock, LogIn, UserIcon } from "lucide-react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");


//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     console.log("Handle submit")

//     const getUserResponse = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     console.log(getUserResponse)

//     if (getUserResponse.ok) {
//       await redirectToDashboard()
//     } else {
//       alert("Login failed");
//     }
//   }

//   return (
//       <>
//       <form onSubmit={
//         (e) => handleSubmit(e)
//         }>
//         <h1>Login</h1>

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//         />

//         <button type="submit">Login</button>
//       </form>
//         <p
//           onClick={() => {
//             window.location.href = "/api/auth/google";
//           }}
//         >
//           Continue with Google
//         </p>
//       </>
//   );
// }

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Handle submit")

    const getUserResponse = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(getUserResponse)

    if (getUserResponse.ok) {
      await redirectToDashboard()
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-40 h-20 rounded-2xl font-black text-3xl mb-6 animate-in zoom-in duration-500">
            Buttr.IO
          </div>

          {/* <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Buttr.IO</h1> */}
          <p className="text-xs uppercase font-bold text-slate-400 tracking-[0.2em]">GEO Intelligence Beta</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <LogIn size={20} className="text-blue-600" />
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in shake duration-300">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Restricted Access • Internal Intelligence Tool
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

// FOR IdP users, check if using their email id's without password works? It should not let them login