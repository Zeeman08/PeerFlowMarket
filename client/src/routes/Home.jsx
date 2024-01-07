import React from 'react';
import Header from '../components/Header';
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';

const Home = () => {
  return (
    <div>
      <Header />
      <SearchBar />
      <UserList />
    </div>
  )
}

export default Home;

