import React, { useState } from "react";
import MapComponent from "./MapComponent"; // Import Map
import Events from "./Events";
import Form from "./form"; // Import the new Form component
import AISuggestionPopup from "./AISuggestionPopup";
import image from "./asset/landing.png";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";



const SignUp = () =>{
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: username,
            createdAt: new Date(),
        });
        navigate("/Landing");
    } catch (err) {
        setError(err.message);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center fromnt-mono bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100% ">
      <div className="flex shadow-2xl">
        {/* <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl
        
        xl:rounded-tr-none xl:rounded-br-none"> */}
        
        <form 
            onSubmit={handleSignUp}
            className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-none xl:rounded-br-none"
            >
          <h1 className="text-5xl font-bold">Create Account</h1>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col text-2xl text-left gap-1">
            <span>Username</span>
            <input type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                   required
                   />
          </div>

          <div className="flex flex-col text-2xl text-left gap-1">
            <span>Email</span>
            <input type="text"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                   required
                   />
          </div>

          <div className="flex flex-col text-2xl text-left gap-1">
            <span>Password</span>
            <input type="text" 
                   value={password}
                   onChange={(e) => setPasword(e.target.value)}
                   className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
                   required
                   />

            {/* <div className="flex gap-1 items-center">
              <input type="checkbox"/>
              <span className="text-base">Remember Password</span>
            </div> */}
          </div>
          <button 
            type="submit"
            className="px-10 py-2 text-2xl rounded-md bg-gradient-to-tr from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white"
            >
                Sign Up
            </button>

            <p>
                Already have an account?{" "}
                <button 
                    type="button"
                    onClick={() => navigate("/")} 
                    className="text-blue-400 hover:underline"
                    >
                        Login
                    </button>
                </p>
                </form>
        {/* </div> */}

        <img src={image} alt="" className='w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl
        xl:block hidden'/>
      </div>
    </section>
  );
};

export default SignUp;
