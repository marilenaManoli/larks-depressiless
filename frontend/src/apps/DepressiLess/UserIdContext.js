// UserIdContext.js
import React, {
  createContext, useContext, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';

const UserIdContext = createContext(null);

export function UserIdProvider({ children }) {
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));

  const contextValue = useMemo(() => ({ userId, setUserId }), [userId, setUserId]);

  return (
    <UserIdContext.Provider value={contextValue}>
      {children}
    </UserIdContext.Provider>
  );
}

UserIdProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
};
