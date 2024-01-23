import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import StoreFront from './routes/StoreFront';
import StoreFrontUpdate from './routes/StoreFrontUpdate';
import ProductUpdate from './routes/ProductUpdate';
import NewProduct from './routes/NewProduct';
import './stylesheet.css';

const App = () => {
  return (
    <div className="Main">
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/store/:id" element={<StoreFront />} />
                <Route exact path="/store/:id/update" element={<StoreFrontUpdate />} />
                <Route exact path="/product/:id/update" element={<ProductUpdate />} />
                <Route exact path="/store/:id/newProduct" element={<NewProduct/>} />
            </Routes>
        </Router>
    </div>
  );
};

export default App;