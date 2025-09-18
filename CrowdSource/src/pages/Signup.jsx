import React, { useState } from "react";
import icon from "../assets/loginicon.png";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("1234-5678-9012");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleSignup = async () => {
    // alert("Pressed!");

    // BACKEND DAALDO
    console.log({
      name,
      phone: `+91${phone}`,
      aadhaar,
      email,
      password,
    });

    const toSend = {
      name,
      phone,
      aadhaar,
      email,
      password,
    };
    try {
      const result = await axios.post("http://localhost/user/register", toSend,{
       withCredentials : true
       }); //ye jo withCredentials h wo secured cookie send krta h backend kojisse ki wo phir authenticate krte ki kya ye bnda is page ko access kr sakta h ya nahi
      const response = result.data;
      if (response.message) {
        console.log(response);
        // navigate to somewhere ( make all the routes that user will be visiting as protected routes i have included in UserAuth.js /auth/check pr get request karo with some httpOnly Cookie )
      } else {
        alert("Couldnt save"); // make something like make user re registere if he gets some error
      }
    } catch (err) {
      alert('smth went wronfg')
      //  make some handling here
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <header className="w-full bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-start py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(1rem,3vw,2rem)]">
          <div className="text-2xl lg:text-3xl font-bold text-black">
            <span className="text-black">Civic</span>
            <span className="text-[#1E5EFF]">Sewa</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6">
        <div
          className="flex flex-col items-center gap-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(2rem,4vw,3rem)] px-[clamp(1rem,4vw,2.5rem)] bg-white rounded-[30px] border-[6px] sm:border-[8px] lg:border-[10px] border-solid border-[#F0F0F0] w-full max-w-[clamp(20rem,70vw,28rem)]"
          style={{ boxShadow: "0px 4px 4px #00000040" }}
        >
          <div className="flex flex-col items-center">
            <img
              src={icon}
              className="w-[clamp(40px,8vw,52px)] h-[clamp(40px,8vw,52px)] object-fill"
              alt="logo"
            />
          </div>

          <div className="flex flex-col items-center text-center mb-2">
            <span className="text-black text-[clamp(1.25rem,3vw,1.5rem)] font-bold">
              Sign up
            </span>
            <span className="text-[#5E5E5E] text-[clamp(0.9rem,2.5vw,1rem)] font-bold">
              Fix your city together.
            </span>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-[#5E5E5E] bg-[#D9D9D9] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 w-full rounded-[10px] focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-[#5E5E5E] bg-[#D9D9D9] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 w-full rounded-[10px] focus:outline-none"
          />

          <input
            type="text"
            placeholder="Aadhaar Number"
            value={aadhaar}
            disabled
            className="text-gray-400 bg-[#E5E5E5] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 w-full rounded-[10px] focus:outline-none cursor-not-allowed"
          />

          <div className="flex items-center w-full">
            <span className="bg-[#D9D9D9] text-black font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-3 rounded-l-[10px] border-r border-gray-400 select-none">
              +91
            </span>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              className="flex-1 text-[#5E5E5E] bg-[#D9D9D9] text-[clamp(0.8rem,2vw,0.95rem)] font-semibold py-[clamp(0.6rem,2vw,0.75rem)] px-4 rounded-r-[10px] focus:outline-none"
            />
          </div>

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
        </div>
      </div>
    </div>
  );
}
