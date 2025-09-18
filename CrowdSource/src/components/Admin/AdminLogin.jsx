import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    // e.preventDefault();
    // try {
    //   const res = await axios.post("http://localhost:80/admin/login", {
    //     email,
    //     password,
    //   });
    //   localStorage.setItem("adminToken", res.data.token);
    //   alert("Login successful!");
    //   // redirect to admin dashboard
    //   window.location.href = "/admin/dashboard";
    // } catch (err) {
    //   setError("Invalid credentials");
    // }
    try{
        if(email==="admin@gmail.com" && password==="admin123"){
            localStorage.setItem("adminToken", "dummyToken");
            alert("Login successful!");
        }
        else{
            setError("Invalid credentials");
        }
    }
    catch(err){
        setError("Invalid credentials");
    }
}

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
