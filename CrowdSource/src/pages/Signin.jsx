import React, { useState } from "react";
import icon from "../assets/loginicon.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Citizen");
  const navigate = useNavigate();
  const handleSignup = async() => {
    // alert(`Pressed! Role: ${role}`);
    console.log({
      role,
      email,
      password,
    });
    const toSend = {
      email,password,role
    }
    try{
      const postTo = (role=='Citizen') ? 'http://localhost/user/login' : 'http://localhost/admin/login'
      const result = await axios.post(postTo,toSend,{
        withCredentials: true // check the signup page line 41
      })
      const response = result.data;
      // console.log(response)
      if(response.message){
        console.log(response.user)
        localStorage.setItem('userDetail',JSON.stringify(response.user))
        const userType = response.user.role;
        if(userType=='user'){
          navigate('/user')
        }else if ( userType == 'admin'){
          navigate('/admin')
        }
      }else{
        //Failure show some error based on what response you get
        alert('cloudnt login')
      }

    }catch(err){
      alert('smth went wrong')
      //make some handling logic
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <header className="w-full bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-start py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(1rem,3vw,2rem)]">
          <div className="text-2xl lg:text-3xl font-bold text-black">
          <span className="text-black">Civic</span><span className="text-[#1E5EFF]">Sewa</span>
        </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6">
        <div
          className="flex flex-col items-center gap-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(2rem,4vw,3rem)] px-[clamp(1rem,4vw,2.5rem)] bg-white rounded-[30px] border-[6px] sm:border-[8px] lg:border-[10px] border-solid border-[#F0F0F0] w-full max-w-[clamp(20rem,70vw,28rem)]"
          style={{ boxShadow: "0px 4px 4px #00000040" }}
        >
          <img
            src={icon}
            className="w-[clamp(40px,8vw,52px)] h-[clamp(40px,8vw,52px)] object-fill"
            alt="logo"
          />

          <div className="flex flex-col items-center text-center mb-2">
            <span className="text-black text-[clamp(1.25rem,3vw,1.5rem)] font-bold">
              Sign in
            </span>
            <span className="text-[#5E5E5E] text-[clamp(0.9rem,2.5vw,1rem)] font-bold">
              Fix your city together.
            </span>
          </div>

          <div className="flex w-full bg-[#F0F0F0] rounded-lg p-1 mb-4">
            {["Citizen", "Admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg font-bold transition-colors duration-200 ${
                  role === r
                    ? "bg-[#1E5EFF] text-white"
                    : "bg-transparent text-black border border-[#C0C0C0]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-[#5E5E5E] bg-[#D9D9D9] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 w-full rounded-[10px] focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-[#5E5E5E] bg-[#D9D9D9] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 w-full rounded-[10px] focus:outline-none"
          />

          <button
            onClick={handleSignup}
            className="mt-2 bg-[#1E5EFF] hover:bg-[#164bcc] text-white text-[clamp(0.9rem,2vw,1rem)] font-bold py-[clamp(0.75rem,2vw,1rem)] px-8 rounded-md shadow-md transition-colors duration-200 w-full"
          >
            Sign up
          </button>
          <div className="mt-4 text-sm text-[#5E5E5E] font-semibold">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#1E5EFF] hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
