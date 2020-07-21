import { useContext, createContext } from 'react'
import { types, onSnapshot } from 'mobx-state-tree'

import { Game } from './game'

const RootModel = types.model({
	game: Game,
})

export const rootStore = RootModel.create({
	game: {},
})

onSnapshot(rootStore, snapshot => console.log('Snapshot: ', snapshot))

const storeContext = createContext(null)

export const StoreProvider = storeContext.Provider

export function useStore() {
	const store = useContext(storeContext)
	if (store === null) {
		throw new Error('Store cannot be null, please add a StoreProvider')
	}
	return store
}
