import { types } from 'mobx-state-tree'

export const Game = types
	.model({
		coll: types.optional(types.number, 0),
		row: types.optional(types.number, 0),
		cells: types.array(types.number),
	})
	.actions(self => ({
		updateCells(cells) {
			if (cells === undefined) {
				return
			}
			self.cells = cells
		},

		updateGrid({ coll, row }) {
			self.coll = coll
			self.row = row
		},
	}))
