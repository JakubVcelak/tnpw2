import React, {useState} from 'react';
import axios from "axios";
import {useSignIn} from "react-auth-kit";
import logo from "../res/logo.png"
import { useNavigate } from "react-router-dom";
import {NotificationManager} from "react-notifications";

//login container
function LoginContainer(props) {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const signIn = useSignIn();
    const navigate = useNavigate()

    //handle login
    function handleLogin() {
        if(login === "" || password === ""){
            NotificationManager.warning('Please fill all fields.', "",2000 )
            return;
        }
            axios.post("https://good-red-hedgehog-kilt.cyclic.app/login", {login: login, password: password})
                .then((response) => {
                    if(response.data.accessToken){
                        signIn({
                            token: response.data.accessToken,
                            expiresIn: 3600,
                            tokenType: "Bearer",
                            authState: { login: login },
                        });
                        return
                    }
                    NotificationManager.error('Invalid login or password!', "",3000 )
                }, (error) => {
                    console.log(error)
                });

        setLogin("")
        setPassword("")
    }

    return (
        <div className=" grid justify-center space-y-5  mt-14 mx-6 sm:mt-24 lg:mt-32 sm:w-96 sm:mx-auto mb-10 sm:mb-20 p-5 rounded-2xl shadow-2xl ">
            <h1 className="text-4xl font-semibold text-center text-orange-400 text-shadow">Contacts</h1>
            <img src={logo} alt="logo" className="mx-auto w-32 "/>
            <input className="font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none"  placeholder="Login"  value={login} onChange={(e => setLogin(e.target.value))}/>
            <input className="font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none" placeholder="Password" value={password} onChange={(e => setPassword(e.target.value))}type="password"/>
            <button onClick={handleLogin} className="font-semibold lg:hover:text-lg lg:hover:w-80 lg:hover:h-12 ease-in duration-300 w-40 mx-auto h-9 shadow-lg rounded-md bg-orange-400 text-white">Login</button>
            <button className="hover:font-bold" onClick={()=>{navigate("/register")}}>Register</button>
        </div>
    );
}

export default LoginContainer;