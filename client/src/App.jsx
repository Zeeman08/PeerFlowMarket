import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import Stores from './routes/Stores';
import StoreFront from './routes/StoreFront';
import StoreFrontUpdate from './routes/StoreFrontUpdate';
import ProductUpdate from './routes/ProductUpdate';
import NewProduct from './routes/NewProduct';
import Product from './routes/Product';
import ViewCart from './routes/viewCart';
import './stylesheet.css';

const App = () => {
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
              <a className="HyperLink" href="/stores">Your Stores</a>
              <a className="HyperLink" href="/stores">Cart</a>
            </div>
        </div>
      </nav>

      {/* main content of the page */}
      <div className="container">
          <Router>
              <Routes>
                  <Route exact path="/" element={<Home />}/>
                  <Route exact path="/stores" element={<Stores />} />
                  <Route exact path="/store/:id" element={<StoreFront />} />
                  <Route exact path="/store/:id/update" element={<StoreFrontUpdate />} />
                  <Route exact path="/product/:id" element={<Product />} />
                  <Route exact path="/product/:id/update" element={<ProductUpdate />} />
                  <Route exact path="/store/:id/newProduct" element={<NewProduct/>} />
                  <Route exact path="/person/:id/viewCart" element={<ViewCart/>} />
              </Routes>
          </Router>
      </div>
    </div>
  );
};

export default App;