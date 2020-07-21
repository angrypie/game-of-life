import React from 'react'
import './App.css'
import { StoreProvider, rootStore } from '../../models/root'
import { Game } from '../game'

const App = () => {
	return (
		<StoreProvider value={rootStore}>
			<div className='App'>
				<div className='App__Container'>
					<Game />
				</div>
			</div>
		</StoreProvider>
	)
}

export default App
