import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME_MAP = {
  light: 'lara-light-indigo',
  dark: 'lara-dark-indigo',
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
	const themeLink = document.getElementById('theme-css');
	if (themeLink) {
	  themeLink.href = `https://unpkg.com/primereact/resources/themes/${THEME_MAP[theme]}/theme.css`;
	}
	localStorage.setItem('theme', theme);
	document.body.style.backgroundColor = theme === 'dark' ? '#1e1e2f' : '#f4f4f4';
	document.body.style.color = theme === 'dark' ? '#ffffff' : '#000000';
  }, [theme]);

  const toggleTheme = () => {
	setTransitioning(true);
	setTimeout(() => {
	  setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
	  setTransitioning(false);
	}, 200); // Match your CSS transition timing
  };

  return (
	<ThemeContext.Provider value={{ theme, toggleTheme, transitioning }}>
	  {children}
	</ThemeContext.Provider>
  );
};