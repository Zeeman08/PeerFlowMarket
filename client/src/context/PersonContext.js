import { useState, createContext, useContext, useEffect } from 'react';

const PersonContext = createContext();

export const PersonContextProvider = ({children}) => {

    const [person, setPerson] = useState({});

    useEffect(() => {
        const getDetails = async () => {
          try {
              const response = await fetch("http://localhost:3005/dashboard/", {
                  method: "GET",
                  headers: {token: localStorage.token}
              });
      
              const parseRes = await response.json();
              setPerson(parseRes);
    
          } catch (error) {
              console.log(error);
          }
        };
    
        getDetails();
      }, []);

    return (
        <PersonContext.Provider value={{person, setPerson}}>
            {children}
        </PersonContext.Provider>
    );
};

export const useData = () => useContext(PersonContext);