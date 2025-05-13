import React, { useState } from "react";
import MapComponent from "./MapComponent"; // Import Map
import Events from "./Events";
import Form from "./form"; // Import the new Form component
import AISuggestionPopup from "./AISuggestionPopup";
import image from "./asset/landing.png";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";




const LoginPage = () =>{
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
           await signInWithEmailAndPassword(auth, email, password);
           navigate("/Landing");
        } catch (err) {
            setError("Invalid email or password.");
            console.error(err);
        }
    }
    return (
      <section className="min-h-screen flex items-center justify-center fromnt-mono bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100% ">
        <div className="flex shadow-2xl">
          {/* <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl
          
          xl:rounded-tr-none xl:rounded-br-none"> */}

          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl
          
          xl:rounded-tr-none xl:rounded-br-none">
            <h1 className="text-5xl font-bold">Welcome</h1>
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Email</span>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                required
                />
            </div>
  
            <div className="flex flex-col text-2xl text-left gap-1">
              <span>Password</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                required
                />
  
              <div className="flex gap-1 items-center">
                <input type="checkbox"/>
                <span className="text-base">Remember Password</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
                type="submit"
                className="px-10 py-2 text-2xl rounded-md bg-gradient-to-tr from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white">
                    Login
            </button>
  
              <p>Don't have an account?{" "}<button onClick={() => navigate("/signup")} type="button" className="text-blue-400 hover:underline">
                Register
            </button>
            </p>
          {/* </div> */}
          </form>
  
          <img src={image} alt="" className='w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl
          xl:block hidden'/>
        </div>
      </section>
    );
  };
  
  export default LoginPage;