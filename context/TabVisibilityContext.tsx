import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TabVisibilityContextProps {
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

const TabVisibilityContext = createContext<TabVisibilityContextProps>({
  tabBarVisible: true,
  setTabBarVisible: () => {},
});

export const TabVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [tabBarVisible, setTabBarVisible] = useState(true);
  return (
    <TabVisibilityContext.Provider value={{ tabBarVisible, setTabBarVisible }}>
      {children}
    </TabVisibilityContext.Provider>
  );
};

export const useTabVisibility = () => useContext(TabVisibilityContext);
