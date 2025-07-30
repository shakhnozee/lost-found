import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Heading from './heading';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<div className="h-screen grid place-items-center">
			<Heading />
		</div>
	</StrictMode>
);
