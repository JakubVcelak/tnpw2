import React from 'react';
import {useSignOut} from "react-auth-kit";
import {useAuthUser} from 'react-auth-kit'
import logo from "../res/logo.png";
import logout from "../res/logout.png";
import {useNavigate} from "react-router-dom";

function Header(props) {
    const singOut = useSignOut();
    const auth = useAuthUser()
    const navigate = useNavigate()

    return (
        <div className="flex shadow-lg bg-gray-white h-20 rounded-b-3xl mx-1.5">
            <img src={logo} className= "w-16 h-16 bg-white rounded-2xl mt-2 ml-5"/>
            <div className="flex ml-auto mr-5">
                <h1 className="mt-6 text-gray-400 text-2xl ">{auth().login}</h1>
                <img src={logout} onClick={()=>{singOut(); navigate('/')}} className= "w-10 h-10 bg-white p-1 rounded-xl mt-5 ml-3 hover:cursor-pointer lg:hover:w-11 lg:hover:h-11 ease-in duration-300"/>
            </div>
        </div>
    );
}

export default Header;