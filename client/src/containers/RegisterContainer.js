import React, {useState} from 'react';
import axios from "axios";
import {useSignIn} from "react-auth-kit";
import logo from "../res/logo.png"
import { useNavigate } from "react-router-dom";
import {NotificationManager} from 'react-notifications';

// container for user registration
function RegisterContainer(props) {
    const [email, setEmail] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCPassword] = useState("")
    const signIn = useSignIn();
    const navigate = useNavigate()

    //handle registration
    function handleRegister() {
        if(email ==="" || login ==="" || password ==="" || cPassword ===""){
            NotificationManager.warning('Please fill all required fields.', "",2000 )
            return
        }
        if(password !== cPassword){
            NotificationManager.error('Different passwords!', "",3000 )
            return;
        }
        if(login.length<5){
            NotificationManager.error('Short login!', "",3000 )
            return;
        }
        if(password.length<8){
            NotificationManager.error('Short password!', "",3000 )
            return;
        }

        axios.post("http://127.0.0.1:3001/register", {email: email, login: login, password: password})
            .then((response) => {
                if(response.data === ""){
                    NotificationManager.error('Username already exists.', "",3000 )
                    return
                }
                signIn({
                    token: response.data.accessToken,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: { login: login },
                });
                navigate("/")

            }, (error) => {
                console.log(error)
            });
        setEmail("")
        setLogin("")
        setPassword("")
        setCPassword("")
    }


    return (
        <div className=" grid justify-center mx-6 mt-4 sm:mt-16 xl:mt-20 sm:w-96 sm:mx-auto mb-10 sm:mb-16 p-5 rounded-2xl shadow-2xl mb-10 sm:mb-20">
            <h1 className="text-4xl font-semibold text-center text-orange-400 text-shadow">Contacts</h1>
            <img src={logo} alt="logo" className="mx-auto w-32 mt-5"/>
            <h3 className="mt-1 ml-1 font-bold mt-5">Email*</h3>
            <input className="sm:font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Email*" value={email} onChange={(e => setEmail(e.target.value))}/>
            <h3 className="mt-1 ml-1 font-bold mt-5">Login*  <span className="mt-1 ml-1 text-sm font-normal">(min 5 characters)</span></h3>
            <input className="sm:font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Login*" value={login} onChange={(e => setLogin(e.target.value))}/>
            <h3 className="mt-1 ml-1 font-bold mt-5">Password*  <span className="mt-1 ml-1 text-sm font-normal">(min 8 characters)</span></h3>
            <input className="sm:font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Password*" value={password} onChange={(e => setPassword(e.target.value))}type="password"/>
            <h3 className="mt-1 ml-1 font-bold mt-5">Confirm password*</h3>
            <input className="sm:font-semibold sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Confirm password*"  value={cPassword} onChange={(e => setCPassword(e.target.value))}type="password"/>
            <button onClick={handleRegister} className="font-semibold lg:hover:text-lg lg:hover:w-80 lg:hover:h-12 ease-in duration-300 w-40 mx-auto h-9 shadow-lg rounded-md bg-orange-400 text-white mt-7">Register</button>
            <button className="hover:font-bold mt-3" onClick={()=>{navigate("/")}}>Login</button>
        </div>
    );
}

export default RegisterContainer;