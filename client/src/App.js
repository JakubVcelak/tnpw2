import MainContainer from "./containers/MainContainer";
import LoginContainer from "./containers/LoginContainer";
import RegisterContainer from "./containers/RegisterContainer";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useIsAuthenticated, useSignOut} from "react-auth-kit";
import Footer from "./components/Footer";
import 'react-notifications/lib/notifications.css';
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import AddEditContainer from "./containers/AddEditContainer";
import DetailsContainer from "./containers/DetailsContainer";
import React, {createContext, useEffect, useState} from 'react';
export const SelectedContactContext = createContext('')

function App() {
    const singOut = useSignOut();
    const navigate = useNavigate()
    const [selectedContact, setSelectedContact] = useState()

    useEffect(() => {
        singOut()
        navigate("/")
    }, []);


    const PrivateRoute = (props) => {
        const isAuthenticated = useIsAuthenticated();
        const auth = isAuthenticated();
        return auth ? props.component : <LoginContainer/>;
    };

  return (
    <div className="font-mono sm:mx-14 md:mx-32 lg:mx-48 xl:mx-64 2xl:mx-96">
        <SelectedContactContext.Provider value={{selectedContact, setSelectedContact}}>
          <Routes>
              <Route path="/" element={<PrivateRoute component={<MainContainer/>}/>}></Route>
              <Route path="/addedit" element={<PrivateRoute component={<AddEditContainer/>}/>}></Route>
              <Route path="/details" element={<PrivateRoute component={<DetailsContainer/>}/>}></Route>

              <Route path="/login" element={<LoginContainer />}></Route>
              <Route path="/register" element={<RegisterContainer/>}></Route>
          </Routes>
        </SelectedContactContext.Provider>
        <Footer/>
        <NotificationContainer/>
    </div>
  );
}

export default App;
