import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Button } from 'primereact/button';

import OutputToolbar from './OutputToolbar'

export default function OutputTable (
	{
		config,
		rows
	}
) {
	
	function getBackgroundColor(r) {
		let flag = false;
		r.values.forEach(v => {
			flag = flag || v < 0;
		})
		return flag ? '#ff0000' : ''
	}
	return (
			<div
				style={{
					padding: '5px',
					border: '1px solid white',
				}}>
			<table border="1" cellPadding="8"
				style={{
					//borderCollapse: "collapse",
					tableLayout: 'fixed',
					width: '100%'
				}}>
				<thead>
				</thead>
				<tbody>
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
											return(<th>Shots ({f})</th>);
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
					{
						rows.map((r, i) => {
							if (! (r.pigment.name == undefined 
								|| (r.values.reduce((a,b) => a + b, 0) == 0))) {
									return(
										<tr key={r.id}
										bgcolor = {getBackgroundColor(r)}
										>
										<td>{r.pigment.name}</td>
										{
											r.values.map(
												v => 
												(<td>{v}</td>)
											)
										}
										</tr>
									)
							}
						})
					}
				</tbody>
			</table>
	</div>
	)
}