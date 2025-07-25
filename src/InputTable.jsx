
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ThemeProvider, useTheme } from './ThemeContext';
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeicons/primeicons.css';

function ColorSquare({ color, size = 50 }) {
  return (
	<div
	  style={{
		width: size,
		height: size,
		backgroundColor: color,
		border: '1px solid #ccc'
	  }}
	/>
  );
}

//Todo: Make it so you can't have multiple rows of the same pigment

export default function InputTable (
	{
		formulaName,
		config,
		rows,
		updateRows,
	}
	) {
	let formula="Formula " + formulaName;
	
	
	//This prevents the user from selecting the same pigment multiple times
	function getAvailablePigments(currentPigment) {
		const selected = rows.map(r => r.pigment?.name); // get names of already selected pigments
		return config.pigments.filter(p => !selected.includes(p.name) || p.name === currentPigment?.name); // exclude them
	}
	
	function addRow() {
		updateRows(prev => [...prev, 
			{
				id: crypto.randomUUID().slice(0, 8),
				pigment: {},
				values: config.fractions.map(v => v * 0)
			}
		])
	}
	
	function removeRow(id) {
		updateRows(prev => prev.filter(item => item.id !== id));
	}
	
	function updateValue(id, col, newValue) {
		console.log('setting value to ' + newValue);
		//check if column has a colorant selected
		let editable = true;
		rows.forEach(item => {
			if(item.id == id) {
				if(!item.pigment || Object.keys(item.pigment).length == 0) {
					editable = false;
				}
			}
		})
		//check if you can use decimals or not
		console.log('editable ' + editable);
		
		//if input value is greater than denominator, set warning color
		if(editable) {
			let passRegex = config.decimals && col > 0 ? /^\d*\.?\d*$/.test(newValue) : /^\d*$/.test(newValue)
			if (passRegex) {
				updateRows(prev => prev.map( item =>
					item.id == id? {
						...item, values: item.values.map((oldValue, j) => j==col ? newValue : oldValue)
					} : (item)
				))}}
	}
	
	function updatePigment(id, newValue) {
		updateRows(prev => prev.map( item =>
			item.id === id ? {
				...item,
				pigment: newValue
			} : (item)
		))
	}
	
	function ColorSquare({ color = '#ccc', size = 24 }) {
	  return (
		<div
		  style={{
			width: size,
			height: size,
			backgroundColor: color,
			border: '1px solid #555',
			borderRadius: '4px'
		  }}
		/>
	  );
	}
	
	function getBackgroundColor(id, i) {
		let color = ''
		
		rows.forEach( v => {
			if(v.id == id) {
				if (i > 0) {
					if(i == 1 || !config.shots) {
						color = v.values[i] >= config.fractions[i] ? "orange" : ""
					} else {
						color = v.values[i] >= config.fractions[i] / config.fractions[1] ? "orange" : ""
					}
				}
			}
		});
		return color;
	}
	
	
	const pigmentOptionTemplate = (option, props) => {
		if (option) {
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<ColorSquare color={option.color} />
				<div>{option.name}</div>
				</div>
			)
		} else {
			return(
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<ColorSquare color="fffff"/>
				<div>.....</div>
				</div>
			)
		}
	}
		
	return (
				<div
				style={{
					padding: '5px',
					border: '1px solid white'
				}}>
				<h2>Formula {formulaName} </h2>
				<table border="1" cellPadding="8"
				style={{
					borderCollapse: "collapse",
					tableLayout: 'fixed',
					width: '100%'
				}}
				
				>
					<thead>
					<tr>
						<th>Pigment</th>
						{
							config.fractions.map((f, i) => 
								{
									if(i == 0) {
										return (<th>Ounces</th>)
									} 
									else if (config.shots) {
										if (i == 1) {
											if(config.decimals) {
												return(<th>Shots + Decimal ({f})</th>);
											}
											else {
												return(<th>Shots ({f})</th>);
											}
										}
										else {
											return(<th>1/{f / config.fractions[1]} Shots</th>);
										}
									}
									else {
										return(<th>1/{f} Ounces </th>);
									}
								}
							)
						}
					</tr>
					</thead>
					<tbody>

						{
							rows.map((r, i) => (
								<tr key={r.id}>
									<td><Button icon="pi pi-times-circle" severity='danger' onClick={() => removeRow(r.id)}/>
									<Dropdown options={getAvailablePigments(r.pigment)}
										value={r.pigment} 
										optionLabel="name"
										onChange={(e) => updatePigment(r.id, e.value)} 
										itemTemplate={pigmentOptionTemplate} 
										valueTemplate={pigmentOptionTemplate}
									/>
									</td>
									{
										r.values.map((v, i) => (
											<td>
											<input value={v ?? 0} onChange={(e) => updateValue(r.id, i, e.target.value)} 
												style={{ width: '80%',
														borderRadius: '5px', 
														height:'100%',	
														display:'inline-block', 
														position:'relative', 
														fontSize:'1.5rem', 
														backgroundColor: getBackgroundColor(r.id, i)
													}}
											/></td>
										))
									}
								</tr>
							))
						}
						<tr>
							<td>
							<Button icon="pi pi-plus-circle" severity='success' onClick={addRow}/>
							</td>
						</tr>
					</tbody>
				</table>
				</div>
	)
}