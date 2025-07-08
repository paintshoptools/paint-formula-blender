import { Button } from 'primereact/button';
import { Card } from 'primereact/card';


export default function FunctionToolbar () {
	return (
		<div>
			<Card title="Functions">
				<div style={{display:'flex', gap:'0.5rem'}}>
					<Button label = "Add"/>
					<Button label = "Subtract" />
					<Button label = "Copy result to Formula A" />
					<Button label = "Copy result to Formula B" />
					<Button label = "Swap formula A and B" />
				</div>
			</Card>
		</div>
	) 
}