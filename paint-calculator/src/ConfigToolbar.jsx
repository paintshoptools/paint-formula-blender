import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber'
import { ThemeProvider, useTheme } from './ThemeContext';
import { SelectButton } from 'primereact/selectbutton';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { BlockUI } from 'primereact/blockui'


import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeicons/primeicons.css';

export default function ConfigToolbar(
  {
	isLocked,
	config,
	setConfig
  }
  ) {
	  
	  /*
	  	Clear All button - dropdown - text inputs (Max 4, 1 shot and 3 fractional shots)
		  
		 this config will be to the right of the clear all button.
	  */
	  
	  const formatChoices = [
		  'Oz/Shot/Fraction',
		  'Oz/Shot/Decimal',
		  'Oz/Fraction',
	  ];
	  
	  const [selectedFormat, setSelectedFormat] = useState(formatChoices[0]);
	  
	  
	  function updateFormat(formatChoice) {
		  let shots = formatChoice == formatChoices[0] || formatChoice == formatChoices[1];
		  let decimals = formatChoice == formatChoices[1];
		  setConfig(prev => ({
			  ...prev,
			  shots: shots,
			  decimals: decimals,
		  }));
		  setSelectedFormat(formatChoice);
	  }
	  
	  function updateFractions(index, value) {
		  /*
		  setConfig (prev => {
			  ...prev,
			  fractions: prev.fractions.with(index, value)
		  })
		  */
	  }
	  
	  function selectPigmentSet() {
		  
	  }
	  
	  
	  const InlineFractionInput = ({ value, onChange }) => {
		return (
		  <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'monospace' }}>
			1<span style={{ margin: '0 2px' }}>/</span>
			<InputText
			  value={value}
			  onChange={(e) => onChange(e.target.value)}
			  style={{
				width: '3ch',
				textAlign: 'center',
				padding: 0,
				fontFamily: 'monospace'
			  }}
			  placeholder="8"
			/>
		  </span>
		);
	  };
	 
	return (
		<table>
			{config.shots ? (
				<thead>
				<th>Shots Per Ounce</th>
				<th>1/X Shot</th>
				<th>1/X Shot</th>
				<th>1/X Shot</th>
				</thead>
				
			):(
				<thead>
				<th>1/X Ounces </th>
				<th>1/X Ounces </th>
				<th>1/X Ounces </th>
				</thead>
			)}
			<tbody>
				<tr>
					<td>
						<input />
					</td>
					<td>
						<input />
					</td>
					<td>
						<input />
					</td>
					<td>
						<input />
					</td>
				</tr>
			</tbody>
		</table>
	)
}