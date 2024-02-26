import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

// import context

import { PersonContextProvider } from './context/PersonContext';

// import routes

import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Stores from './routes/Stores';
import StoreFront from './routes/StoreFront';
import StoreFrontUpdate from './routes/StoreFrontUpdate';
import ProductUpdate from './routes/ProductUpdate';
import NewProduct from './routes/NewProduct';
import Product from './routes/Product';
import YourStores from './routes/YourStores';
import YourStore from './routes/YourStore';
import NewStore from './routes/NewStore';
import ViewCart from './routes/ViewCart';
import PaymentMethod from './routes/PaymentMethod';
//import Transactions from './routes/Transactions';

// import styles

import './stylesheet.css';

const App = () => {

  const [isAuthenticated, setAuthenticated] = useState(true);

  const setAuth = boolean => {
    setAuthenticated(boolean);
  }

  useEffect(() => {

    const isAuth = async () => {
      try {
        const response = await fetch("http://localhost:3005/auth/is-verify", {
          method: "GET",
          headers: { token: localStorage.token }
        });
  
        const parseRes = await response.json();
  
        parseRes === true ? setAuth(true) : setAuth(false);
      } catch (error) {
        console.log(error);
      }
    };

    isAuth();
  }, []);

  return (
    <div>
      {/* navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid d-flex justify-content-center">
            <a className="navbar-brand fs-2 pfmlogo" href="/">Peer Flow Market</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light Navbar">
        <div className="container-fluid">
            <div className="collapse navbar-collapse d-flex justify-content-evenly" id="navbarNavAltMarkup">
              <a className="HyperLink" href="/">Home</a>
              <a className="HyperLink" href="/stores">Stores</a>
              <a className="HyperLink" href={`/yourstores`}>Your Stores</a>
              <a className="HyperLink" href={`/viewCart`}>Cart</a>
            </div>
        </div>
      </nav>

      {/* main content of the page */}
      <div className="container">
          <PersonContextProvider>
            <Router>
                <Routes>
                    <Route exact path="/" element={ isAuthenticated ? <Home setAuth={setAuth} /> : <Navigate to="/login"/>}/>
                    <Route exact path="/login" element={ !isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/"/>}/>
                    <Route exact path="/register" element={ !isAuthenticated ? <Register setAuth={setAuth}/> : <Navigate to="/"/>}/>
                    <Route exact path="/stores" element={ isAuthenticated ? <Stores /> : <Navigate to="/login"/>} />
                    <Route exact path="/yourstores" element={isAuthenticated ? <YourStores /> : <Navigate to="/login"/>} />
                    <Route exact path="/yourstore/:id" element={isAuthenticated ? <YourStore /> : <Navigate to="/login"/>} />
                    <Route exact path="/newstore" element={isAuthenticated ? <NewStore /> : <Navigate to="/login"/>} />
                    <Route exact path="/store/:id" element={isAuthenticated ? <StoreFront /> : <Navigate to="/login"/>} />
                    <Route exact path="/store/:id/update" element={isAuthenticated ? <StoreFrontUpdate /> : <Navigate to="/login"/>} />
                    <Route exact path="/product/:id" element={isAuthenticated ? <Product /> : <Navigate to="/login"/>} />
                    <Route exact path="/product/:id/update" element={isAuthenticated ? <ProductUpdate /> : <Navigate to="/login"/>} />
                    <Route exact path="/store/:id/newProduct" element={isAuthenticated ? <NewProduct/> : <Navigate to="/login"/>} />
                    <Route exact path="/viewCart" element={isAuthenticated ? <ViewCart/> : <Navigate to="/login"/>} />
                    <Route exact path="/paymentMethod" element={isAuthenticated ? <PaymentMethod/> : <Navigate to="/login"/>} />
                </Routes>
            </Router>
          </PersonContextProvider>
      </div>
    </div>
  );
};

export default App;