import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import User from './routes/User';
import UserUpdate from './routes/UserUpdate';

const App = () => {
  return (
    <div className="container">
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/user/:id" element={<User />} />
                <Route exact path="/user/:id/update" element={<UserUpdate />} />
            </Routes>
        </Router>
    </div>
  );
};

export default App;