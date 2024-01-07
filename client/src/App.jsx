import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './routes/Home';
import User from './routes/User';
import UserUpdate from './routes/UserUpdate';

const App = () => {
  return (
    <div>
        <h1>Gawwy's Version</h1>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/user/:id/update" element={<UserUpdate />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App;