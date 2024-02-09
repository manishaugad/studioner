import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setErr(true);
        }
    };
    const divStyle = {
        color: "red",
        fontSize: 15,
    };
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Studion</span>
                <span className="title">LOGIN</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Enter your email" />
                    <input type="password" placeholder="Enter your password" />
                    <button>Sign in</button>
                    {err && <span style={divStyle}>Please Check your credentials!</span>}
                </form>
                <p>
                    You don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
