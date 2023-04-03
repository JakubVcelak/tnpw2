import React, {useState, useContext, useEffect} from 'react';
import Header from "../components/Header";
import {useNavigate} from "react-router-dom";
import back from "../res/back.png";
import {useAuthUser} from "react-auth-kit";
import axios from "axios";
import {SelectedContactContext} from "../App";
import {NotificationManager} from "react-notifications";

//container for adding and editing contacts
function AddEditContainer(props) {
    const navigate = useNavigate()
    const auth = useAuthUser()
    const {selectedContact, setSelectedContact} = useContext(SelectedContactContext)

    const [firstName, setFirstname] =useState("" )
    const [lastName, setLastname] =useState( "")
    const [phone, setPhone] =useState("")
    const [comment, setComment] =useState( "")
    const [group,setGroup] =useState("")
    const [work,setWork] =useState("")
    const [email, setEmail] =useState("")

    //get details about contact
    useEffect(() => {
        if(selectedContact==='')
            return
        axios.get("http://127.0.0.1:3001/contact", {params:{id: selectedContact, login: auth().login, token: document.cookie.split(";")[0].split("=")[1]}})
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


    //add or edit contact depends on selected contact
    function handleSubmit() {
        const input ={firstName: firstName, lastName: lastName, phone:phone, comment:comment, group:group, work:work, email:email}
        if(firstName === '' || lastName ==='' || phone ===''){
            NotificationManager.warning('Please fill all required fields.', "",2000 )
            return
        }
        if(selectedContact === ''){
            axios.post("http://127.0.0.1:3001/createContact", {login: auth().login, token: document.cookie.split(";")[0].split("=")[1], input: input})
                .then((response) => {
                    if(response.data === ""){
                        NotificationManager.error('Server error!', "",3000 )
                        return
                    }
                    NotificationManager.success('Successfully added!', "",3000 )
                    navigate('/')
                }, (error) => {
                    console.log(error);
                });
        }else{
            axios.put("http://127.0.0.1:3001/updateContact", {login: auth().login, token: document.cookie.split(";")[0].split("=")[1], input: input, id: selectedContact})
                .then((response) => {
                    if(response.data === ""){
                        NotificationManager.error('Server error!', "",3000 )
                        return
                    }
                    navigate('/')
                    NotificationManager.success('Successfully updated!', "",3000 )
                }, (error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div>
            <Header/>
            <img src={back} alt="back" onClick={()=>{navigate('/')}} className="grid shadow-xl rounded-2xl bg-orange-400 w-12 h-12 sm:w-14 sm:h-14 font-bold mt-5 mx-auto lg:hover:h-16 lg:hover:w-16 ease-in duration-300 cursor-pointer "/>
            <div className=" grid justify-center mt-5 sm:w-96 mx-6 sm:mx-auto p-5 rounded-2xl shadow-2xl my-10 ">
                <h1 className="text-4xl font-semibold text-center text-orange-400">{selectedContact !== ''? "Update contact": "Add contact"}</h1>
                <h3 className="mt-1 ml-1 font-bold mt-5 text">First name*</h3>
                <input className="sm:font-bold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="First name*" value={firstName} onChange={(e => setFirstname(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Last name*</h3>
                <input className="sm:font-semibold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Last name*" value={lastName} onChange={(e => setLastname(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Phone number*</h3>
                <input className="sm:font-semibold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Phone number*" value={phone} onChange={(e => setPhone(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Comment</h3>
                <textarea rows="5" className=" resize-none sm:font-semibold w-72 sm:w-80 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400"  placeholder="Comment" value={comment} onChange={(e => setComment(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Group</h3>
                <input className="sm:font-semibold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Group" value={group} onChange={(e => setGroup(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Work</h3>
                <input className="sm:font-semibold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Work" value={work} onChange={(e => setWork(e.target.value))}/>
                <h3 className="mt-1 ml-1 font-bold mt-5">Email</h3>
                <input className="sm:font-semibold w-72 sm:w-80 h-10 shadow-lg bg-gray-100 rounded-md pl-2 outline-none text-orange-400" placeholder="Email" value={email} onChange={(e => setEmail(e.target.value))}/>
                <button onClick={handleSubmit} className="font-semibold sm:hover:text-lg sm:hover:w-80 sm:hover:h-12 ease-in duration-300 w-40 mx-auto h-9 mt-5 shadow-lg rounded-md bg-orange-400 text-white ">{selectedContact !== ''? "Update": "Add"}</button>
            </div>
        </div>
    );
}

export default AddEditContainer;