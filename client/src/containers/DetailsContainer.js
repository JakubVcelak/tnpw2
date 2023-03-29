import React, {useContext, useEffect, useState} from 'react';
import Header from "../components/Header";
import {useNavigate} from "react-router-dom";
import back from "../res/back.png";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {SelectedContactContext} from "../App";
import {NotificationManager} from "react-notifications";

function DetailsContainer(props) {
    const navigate = useNavigate()
    const auth = useAuthUser()
    const {selectedContact, setSelectedContact} = useContext(SelectedContactContext)

    const [firstName, setFirstname] =useState("")
    const [lastName, setLastname] =useState("")
    const [phone, setPhone] =useState("")
    const [comment, setComment] =useState("")
    const [group,setGroup] =useState("")
    const [work,setWork] =useState("")
    const [email, setEmail] =useState("")

    useEffect(() => {
        axios.get("http://localhost:3001/contact", {params:{id: selectedContact, login: auth().login, token: document.cookie.split(";")[0].split("=")[1]}})
            .then((response) => {
                if(response.data === ""){
                    NotificationManager.error('Server error!', "",3000 )
                    return
                }
                setFirstname(response.data.firstname)
                setLastname(response.data.lastname)
                setPhone(response.data.phone)
                setComment(response.data.comment)
                setGroup(response.data.group)
                setWork(response.data.work)
                setEmail(response.data.email)
            }, (error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <Header/>
            <img src={back} alt="back" onClick={()=>{navigate('/')}} className="grid shadow-xl rounded-2xl bg-orange-400 w-12 h-12 sm:w-14 sm:h-14 font-bold mt-5 mx-auto lg:hover:h-16 lg:hover:w-16 ease-in duration-300 cursor-pointer "/>
            <div className=" grid justify-center sm:w-96 2xl:w-1/2 mx-6 sm:mx-auto p-5 rounded-2xl shadow-2xl my-10 space-y-2  text-center text-xl text-orange-400">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-black pb-2 border-b-4 border-gray-100">{firstName} {lastName}</h1>
                <h2 className="pt-2"> <span className=" text-black">Phone number:</span> {phone}</h2>
                <h2> <span className="text-black ">Comment:</span> {comment}</h2>
                <h2> <span className="text-black ">Group:</span> {group}</h2>
                <h2> <span className="text-black">Work:</span> {work}</h2>
                <h2> <span className="text-black">Email:</span> {email}</h2>
            </div>
        </div>
    );
}

export default DetailsContainer;