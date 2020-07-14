import React, { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const Host = "http://localhost:9090";

const App = () => {
	return (
		<div className="App">
			<div className="App__Container">
				<Board />
			</div>
		</div>
	);
};

const stateModel = {
	cells: [],
	coll: 0,
	row: 0
};

const Board = () => {
	const [state, setState] = useState(stateModel);

	const updateCells = cells => {
		if (cells !== undefined) {
			setState(state => ({ ...state, cells }));
		}
	};
	const updateGrid = ({ coll, row }) => {
		setState(state => ({ coll, row, cells: state.cells }));
	};
	return (
		<div className="Life">
			<div className="Board" style={{ width: `${12 * state.coll}px` }}>
				{state.cells.map((cell, key) => (
					<Cell key={key} id={key} state={cell} updateCells={updateCells} />
				))}
			</div>

			<div className="Controll">
				<Controll updateGrid={updateGrid} updateCells={updateCells} />
			</div>
		</div>
	);
};

const Cell = ({ id, state, updateCells }) => {
	return (
		<div
			className="Cell"
			onClick={() => {
				fetch(`${Host}/state/${id}`, { method: "POST" })
					.then(res => res.json())
					.then(() => {
						fetch(`${Host}/state`, { method: "POST" })
							.then(res => res.json())
							.then(body => updateCells(body.State));
					});
			}}
		>
			<div className={state === 1 ? "Cell__fill" : ""}></div>
		</div>
	);
};

const Controll = ({ updateGrid, updateCells }) => {
	const inputColl = useRef(null);
	const inputRow = useRef(null);

	const makeStep = useCallback(() => {
		fetch(`${Host}/step`, { method: "POST" })
			.then(res => res.json())
			.then(() => {
				fetch(`${Host}/state`, { method: "POST" })
					.then(res => res.json())
					.then(body => updateCells(body.State));
			});
	}, [updateCells]);

	const [timer, setTimer] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			if (timer) {
				makeStep();
			}
		}, 200);
		return () => clearInterval(interval);
	}, [makeStep, timer]);

	return (
		<div className="Controll">
			<div className="Controll_size">
				<div>
					<div>Col</div>
					<input type="text" ref={inputColl} />
				</div>
				<div>
					<div>Row</div>
					<input type="text" ref={inputRow} />
				</div>
				<button
					onClick={() => {
						let coll = Number(inputColl.current.value);
						let row = Number(inputRow.current.value);
						updateGrid({ coll, row });
						fetch(`${Host}/game/${coll}/${row}`, { method: "POST" })
							.then(res => res.json())
							.then(() => {
								fetch(`${Host}/state`, { method: "POST" })
									.then(res => res.json())
									.then(body => updateCells(body.State));
							});
					}}
				>
					Create
				</button>
			</div>
			<div className="Controll_move">
				<button onClick={() => makeStep()}>Next</button>
				<button onClick={() => setTimer(true)}>Start</button>
				<button onClick={() => setTimer(false)}>Stop</button>
			</div>
		</div>
	);
};

export default App;
