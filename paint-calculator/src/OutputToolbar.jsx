import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function OutputToolbar () {
	
	let formulaTypes = [
		{name: 'Oz/Shot/Fraction'},
		{name: 'Oz/Shot/Decimal'},
		{name: 'Oz/Fraction'}]
	return (
		<Card>
			<Dropdown label="formulaType" options={formulaTypes} optionLabel="name" placeholder="Select Formula Type for Output"/>
			<Button label="Button2" />
			<Button label="Button3" />
		</Card>
	)
}