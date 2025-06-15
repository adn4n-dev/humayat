import React, { useState } from 'react';
import { PlusCircle, Check } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const { users, currentUser, setCurrentUser, addUser } = useUserContext();
  const [newUserName, setNewUserName] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const handleSelectUser = (user: { id: string; name: string }) => {
    setCurrentUser(user);
    onClose();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      const user = addUser(newUserName.trim());
      setCurrentUser(user);
      setNewUserName('');
      setShowAddUser(false);
      onClose();
    }
  };

  // Close when clicking outside the menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (!element.closest('.user-menu')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="user-menu absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none origin-top-right transition transform duration-200 ease-out">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
        <div className="px-4 py-2 text-xs text-gray-500 border-b">kullanıcı sec</div>
        
        <div className="max-h-60 overflow-y-auto py-1">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`w-full text-left px-4 py-2 text-sm group flex items-center justify-between ${
                currentUser?.id === user.id 
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              role="menuitem"
            >
              <span>{user.name}</span>
              {currentUser?.id === user.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
        
        <div className="border-t">
          {showAddUser ? (
            <form onSubmit={handleAddUser} className="px-3 py-2">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="kullanıcı adı girrr"
                className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                autoFocus
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900"
                >
                  iptal
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-xs bg-red-800 text-white rounded hover:bg-red-700"
                >
                  ekle
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddUser(true)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-900 flex items-center"
              role="menuitem"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>yeni kullanıcı ekle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenu;