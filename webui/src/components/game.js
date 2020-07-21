import React, { useState, useRef, useEffect, useCallback } from 'react'
import { observer } from 'mobx-react'
import { useStore } from '../models/root'

const Host = 'http://localhost:9090'

export const Game = observer(() => {
	const { game } = useStore()
	const updateCells = cells => game.updateCells(cells)
	const updateGrid = grid => game.updateGrid(grid)

	return (
		<div className='Life'>
			<div className='Board' style={{ width: `${12 * game.coll}px` }}>
				{game.cells.map((cell, key) => (
					<Cell key={key} id={key} state={cell} updateCells={updateCells} />
				))}
			</div>

			<div className='Controll'>
				<Controll updateGrid={updateGrid} updateCells={updateCells} />
			</div>
		</div>
	)
})

const Cell = ({ id, state, updateCells }) => {
	return (
		<div
			className='Cell'
			onClick={() => {
				fetch(`${Host}/state/${id}`, { method: 'POST' })
					.then(res => res.json())
					.then(() => {
						fetch(`${Host}/state`, { method: 'POST' })
							.then(res => res.json())
							.then(body => updateCells(body.State))
					})
			}}
		>
			<div className={state === 1 ? 'Cell__fill' : ''}></div>
		</div>
	)
}

const Controll = ({ updateGrid, updateCells }) => {
	const inputColl = useRef(null)
	const inputRow = useRef(null)

	const makeStep = useCallback(() => {
		fetch(`${Host}/step`, { method: 'POST' })
			.then(res => res.json())
			.then(() => {
				fetch(`${Host}/state`, { method: 'POST' })
					.then(res => res.json())
					.then(body => updateCells(body.State))
			})
	}, [updateCells])

	const [timer, setTimer] = useState(false)
	useEffect(() => {
		const interval = setInterval(() => {
			if (timer) {
				makeStep()
			}
		}, 200)
		return () => clearInterval(interval)
	}, [makeStep, timer])

	return (
		<div className='Controll'>
			<div className='Controll_size'>
				<div>
					<div>Col</div>
					<input type='text' ref={inputColl} />
				</div>
				<div>
					<div>Row</div>
					<input type='text' ref={inputRow} />
				</div>
				<button
					onClick={() => {
						let coll = Number(inputColl.current.value)
						let row = Number(inputRow.current.value)
						updateGrid({ coll, row })
						fetch(`${Host}/game/${coll}/${row}`, { method: 'POST' })
							.then(res => res.json())
							.then(() => {
								fetch(`${Host}/state`, { method: 'POST' })
									.then(res => res.json())
									.then(body => updateCells(body.State))
							})
					}}
				>
					Create
				</button>
			</div>
			<div className='Controll_move'>
				<button onClick={() => makeStep()}>Next</button>
				<button onClick={() => setTimer(true)}>Start</button>
				<button onClick={() => setTimer(false)}>Stop</button>
			</div>
		</div>
	)
}
