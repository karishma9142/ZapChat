import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {

    const navigate = useNavigate();
    const { updateProfile } = useContext(AuthContext);

    const [preview, setPreview] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            const base64 = await convertToBase64(file);
            setProfilePic(base64);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            fullName,
            bio,
            profilePic
        };

        console.log(body);

        await updateProfile(body);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
            <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 
            flex items-center justify-between max-sm:flex-col-reverse rounded-xl shadow-2xl">

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6 p-10">

                    <h3 className="text-2xl font-semibold text-white">Profile Details</h3>

                    <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer group">
                        <input
                            type="file"
                            id="avatar"
                            accept=".png,.jpg,.jpeg"
                            hidden
                            onChange={handleImageChange}
                        />

                        <img
                            src={preview || assets.avatar_icon}
                            alt="Profile"
                            className="w-14 h-14 rounded-full border-2 border-gray-500 
                            group-hover:border-violet-500 transition-all duration-300"
                        />

                        <p className="text-sm text-gray-400 group-hover:text-violet-400 transition">
                            Upload profile image
                        </p>
                    </label>

                    <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="p-3 bg-transparent border border-gray-500 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500
                        focus:border-violet-500 transition-all"
                    />

                    <textarea
                        placeholder="Write profile bio"
                        required
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="p-3 bg-transparent border border-gray-500 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-violet-500
                        focus:border-violet-500 transition-all resize-none"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-400 to-violet-600 
                        hover:from-violet-500 hover:to-purple-600
                        text-white p-3 rounded-full text-lg font-medium
                        transition-all duration-300 shadow-lg hover:shadow-violet-500/30"
                    >
                        Save Changes
                    </button>

                </form>

                <img
                    className="max-w-52 aspect-square rounded-full mx-10 max-sm:mt-10 opacity-90"
                    src={assets.logo_icon}
                    alt=""
                />

            </div>
        </div>
    );
}

export default ProfilePage;