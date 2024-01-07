import React, {useState, createContext} from "react";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
const [users, setUsers] = useState([]);

    return(
        <UserContext.Provider value={{users, setUsers}}>
            {props.children}
        </UserContext.Provider>
    );
};