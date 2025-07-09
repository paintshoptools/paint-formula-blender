import React, { useState } from "react";
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';

export default function ModeToggle () {
	
	let options = [
		'calculator', 'converter'
	];
	
	const [value, setValue] = useState(options[0]);
	
	return (
		<Card>
			<SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} />
		</Card>	
	)
}