import React, {useContext} from 'react';
import del from "../res/delete.png";
import edit from "../res/edit.png";
import detail from "../res/detail.png";
import axios from "axios";
import {useAuthUser} from "react-auth-kit";
import {ContactsContext} from "../containers/MainContainer";
import {useNavigate} from "react-router-dom";
import {SelectedContactContext} from "../App";
import {NotificationManager} from "react-notifications";

//contact component
function Contact(props) {
    const auth = useAuthUser()
    const {contacts, setContacts} = useContext(ContactsContext)
    const {selectedContact, setSelectedContact} = useContext(SelectedContactContext)
    const navigate = useNavigate()

    function handleDelete() {
        axios.delete("https://good-red-hedgehog-kilt.cyclic.app/deleteContact", {params:{id: props.id, login: auth().login, token: document.cookie.split(";")[0].split("=")[1]}})
            .then((response) => {
                if(response.data === ""){
                    NotificationManager.error('Server error!', "",3000 )
                    return
                }
                NotificationManager.success('Contact deleted.', "",2000 )
                setContacts(contacts.filter(c=>c._id !== props.id))
            }, (error) => {
                console.log(error);
            });
    }

    return (
        <div className="my-3 mx-3 text-center bg-gray-50 rounded-2xl w-80 py-2 shadow-lg">
            <h1 className="font-bold text-2xl text-orange-400">{props.firstName} {props.lastName}</h1>
            <h2 className="text-lg"> <span className="font-bold">Phone number:</span> {props.phone}</h2>
            <div className="flex justify-center mt-2">
                <img src={detail} alt="detail" onClick={()=>{navigate('/details'); setSelectedContact(props.id)}} className= "w-8 h-8 bg-green-500 p-1 rounded-xl hover:cursor-pointer lg:hover:w-9 lg:hover:h-9 ease-in duration-300 shadow-lg"/>
                <img src={edit} alt="edit" onClick={()=>{navigate('/addedit'); setSelectedContact(props.id)}} className= "ml-3 w-8 h-8 bg-yellow-400 p-1 rounded-xl hover:cursor-pointer lg:hover:w-9 lg:hover:h-9 ease-in duration-300 shadow-lg"/>
                <img src={del} alt="delete" onClick={handleDelete} className= " ml-3 w-8 h-8 bg-red-500 p-1 rounded-xl  hover:cursor-pointer lg:hover:w-9 lg:hover:h-9 ease-in duration-300 shadow-lg"/>
            </div>
        </div>
    );
}

export default Contact;