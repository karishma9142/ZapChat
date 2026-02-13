import React from "react";
import assets from "../assets/assets";

function ChatContainer({ selectedser, setSelectedUser }){
    return (
        <div>
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img src={assets.profile_martin} alt="martin" className="w-8 rounded-full"/>
                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    Martin Johnson
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className="md:hidden max-w-7"/>
            </div>
        </div>
    )
}

export default ChatContainer;