import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  addUser: (name: string) => User;
  getUser: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  users: [],
  setCurrentUser: () => {},
  addUser: () => ({ id: '', name: '' }),
  getUser: () => undefined
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('photoArchiveUsers');
    const savedCurrentUser = localStorage.getItem('photoArchiveCurrentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Add a default user if none exist
      const defaultUser = { id: uuidv4(), name: 'Kullanıcı' };
      setUsers([defaultUser]);
      localStorage.setItem('photoArchiveUsers', JSON.stringify([defaultUser]));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('photoArchiveCurrentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('photoArchiveCurrentUser');
    }
  }, [currentUser]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('photoArchiveUsers', JSON.stringify(users));
  }, [users]);

  const addUser = (name: string): User => {
    const newUser = { id: uuidv4(), name };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider value={{ currentUser, users, setCurrentUser, addUser, getUser }}>
      {children}
    </UserContext.Provider>
  );
};