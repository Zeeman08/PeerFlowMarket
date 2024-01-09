import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import StoreFront from './routes/StoreFront';
import StoreFrontUpdate from './routes/StoreFrontUpdate';

const App = () => {
  return (
    <div className="container">
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/store/:id" element={<StoreFront />} />
                <Route exact path="/store/:id/update" element={<StoreFrontUpdate />} />
                {/* <Route exact path="/product/:id/update" element={<ProductUpdate />} /> */}
            </Routes>
        </Router>
    </div>
  );
};

export default App;