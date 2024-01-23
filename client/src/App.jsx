import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import Stores from './routes/Stores';
import StoreFront from './routes/StoreFront';
import StoreFrontUpdate from './routes/StoreFrontUpdate';
import ProductUpdate from './routes/ProductUpdate';
import NewProduct from './routes/NewProduct';
import Product from './routes/Product';
import './stylesheet.css';

const App = () => {
  return (
    <div>
      {/* navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">PFM</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                </div>
            </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light Navbar">
        <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className="HyperLink" href="/">Home</a>
                    <a className="HyperLink" href="/stores">Stores</a>
                    <a className="HyperLink" href="/stores">Your Stores</a>
                    <a className="HyperLink" href="/stores">Cart</a>
                </div>
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
              </Routes>
          </Router>
      </div>
    </div>
  );
};

export default App;