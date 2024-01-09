import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import User from './routes/User';
import StoreFrontUpdate from './routes/StoreFrontUpdate';

const App = () => {
  return (
    <div className="container">
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/store/:id" element={<User />} />
                <Route exact path="/store/:id/update" element={<StoreFrontUpdate />} />
                
            </Routes>
        </Router>
    </div>
  );
};

export default App;