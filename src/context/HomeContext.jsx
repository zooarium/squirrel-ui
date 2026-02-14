/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, _setSelectedCategory] = useState('All');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const openSignUp = () => {
    setIsSignUpOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    document.body.style.overflow = 'auto';
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    closeLogin();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const setSelectedCategory = (category) => {
    if (category !== selectedCategory) {
      setPosts([]);
      setScrollPosition(0);
      setIsAutoLoading(true);
      _setSelectedCategory(category);
    }
  };

  return (
    <HomeContext.Provider
      value={{
        posts,
        setPosts,
        selectedCategory,
        setSelectedCategory,
        scrollPosition,
        setScrollPosition,
        isAutoLoading,
        setIsAutoLoading,
        isSignUpOpen,
        openSignUp,
        closeSignUp,
        isLoginOpen,
        openLogin,
        closeLogin,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
