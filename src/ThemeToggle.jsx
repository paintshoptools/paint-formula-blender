import React from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { useTheme } from './ThemeContext';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeicons/primeicons.css';


const options = [
  { icon: 'pi pi-sun', value: 'light' },
  { icon: 'pi pi-moon', value: 'dark' },
];

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
	<SelectButton
	  value={theme}
	  options={options}
	  onChange={(e) => toggleTheme()}
	  itemTemplate={(option) => <i className={option.icon} />}
	  optionLabel="icon"
	  unselectable={false}
	  className="p-button-outlined"
	/>
  );
}