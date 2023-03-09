import React, {createContext, useEffect, useContext, useState} from 'react';
import axios from "axios";
import {useAuthUser} from 'react-auth-kit'
import Contact from "../components/Contact";
import Header from "../components/Header";
import add from "../res/add.png";
import {useNavigate} from "react-router-dom";
import {SelectedContactContext} from "../App";
import {NotificationManager} from "react-notifications";
export const ContactsContext = createContext([])

function MainContainer() {
    const auth = useAuthUser()
    const [contacts, setContacts] = useState([])
    const navigate = useNavigate()
    const {selectedContact, setSelectedContact} = useContext(SelectedContactContext)

    useEffect(() => {
        setSelectedContact('')
        setTimeout(()=>{
            axios.get("http://localhost:3001/contacts", {params:{login: auth().login, token: document.cookie.split(";")[0].split("=")[1]}})
                .then((response) => {
                    if(response.data === ""){
                        NotificationManager.error('Server error!', "",3000 )
                        return
                    }
                    setContacts(response.data)
                }, (error) => {
                    console.log(error);
                });
        }, 1);
    },[]);

    function handleAddEdit() {
        navigate('/addedit')
    }


    function renderContacts(con) {
        return con.map(c=><Contact key={c._id} id={c._id} firstName={c.firstname} lastName={c.lastname} phone={c.phone} comment={c.comment} type={c.type}/>)
    }

    return (
        <div>
            <Header/>
            <ContactsContext.Provider value={{contacts, setContacts}}>
                <img src={add} onClick={handleAddEdit} className= "mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-orange-400 p-1 shadow-lg rounded-xl mt-5  hover:cursor-pointer lg:hover:w-16 lg:hover:h-16 ease-in duration-300"/>
                <div className="flex flex-wrap justify-center">
                    {renderContacts(contacts)}
                </div>
            </ContactsContext.Provider>
        </div>
    );
}

export default MainContainer;