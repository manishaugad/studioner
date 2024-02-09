import React from "react";
import { useState } from "react";
import Add from "../img/addAvatar.png";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
        

            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            try {
                // Wait for the upload task to complete
                await uploadTask;

                // Get the download URL
                const downloadURL = await getDownloadURL(storageRef);

                // Update user profile and set documents in Firestore
                await Promise.all([
                    updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL,
                    }),
                    setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL,
                    }),
                    setDoc(doc(db, "userChats", res.user.uid), {}),
                ]);

                // Navigate to the desired location
                navigate("/");
            } catch (error) {
                // Handle errors

                setErr(true);
            }
        } catch (error) {
            setErr(true);
            console.log(err)
        }


    }
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">STUDION</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter your name" />
                    <input type="email" placeholder="Enter your email" />
                    <input type="password" placeholder="Enter your password" />
                    <input style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button >SignUp</button>

                </form>
                <p>
                    You do have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register