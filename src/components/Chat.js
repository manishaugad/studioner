import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
const Chat = () => {
    const { data } = useContext(ChatContext);
    const buttonStyle = {
        backgroundColor: "#19ec58",
        color: "#0f91e7",
        fontSize: "12px",
        fontWeight: "bold",
        height: "30px",
        width: "70px",
        borderRadius: "50cm",
        border: "3px solid gold",
    };
    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <button style={buttonStyle} onClick={() => signOut(auth)}>
                    Logout
                </button>
            </div>
            <Messages />
            <Input />
        </div>
    );
};

export default Chat;
