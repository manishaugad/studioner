import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        try {
            if (img) {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, img);

                // Wait for the upload task to complete
                await uploadTask;

                // Get the download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Update the chat document with the new message containing the image
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURL,
                    }),
                });
            } else {
                // Update the chat document with the new message without an image
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    }),
                });
            }

            // Update the userChats document for the current user
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [`${data.chatId}.lastMessage`]: {
                    text,
                },
                [`${data.chatId}.date`]: serverTimestamp(),
            });

            // Update the userChats document for the other user in the chat
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [`${data.chatId}.lastMessage`]: {
                    text,
                },
                [`${data.chatId}.date`]: serverTimestamp(),
            });

            // Clear text and image states
            setText("");
            setImg(null);
        } catch (error) {
            console.error("Error occurred while sending message:", error);
            // Handle error gracefully
        }
    };

    return (
        <div className="input">
            <input
                type="text"
                placeholder="Type Something..."
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <div className="send">
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                    <img src={Img} alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Input;
