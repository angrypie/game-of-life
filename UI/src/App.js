import React, { Component } from 'react';
import './App.css';

const Host = "http://localhost:9090"

class App extends Component {
  render() {
    return (
      <div className="App">
		  <div className="App__Container">
			  <Board />
		  </div>
      </div>
    );
  }
}

const State = {
	cells: [],
	coll: 0,
	row: 0,
	updateState: null,
}


class Board extends Component {
	componentWillMount() {
		State.updateState = (cells) => {
			if(cells !== undefined)
				State.cells = cells
			this.forceUpdate()
		}
	}
  render() {
    return (
		<div className="Life">
			<div className="Board" style={{width: `${12 * State.coll }px`}}>
				{
					State.cells.map((cell, key) =>
						<Cell key={key} id={key} state={cell} />)
				}
			</div>

			<div className="Controll">
				<Controll />
			</div>
		</div>
    );
  }
}

class Cell extends Component {
	render() {
		let { id, state } = this.props
		return (
			<div className="Cell" onClick={() => {
				fetch(`${Host}/state/${id}`,
				{ method: 'POST' })
				.then(res => res.json())
				.then(body => {
					fetch(`${Host}/state`,{ method: 'POST' })
					.then(res => res.json())
					.then(body => State.updateState(body.State))
				})
			}}>
				<div className={state === 1 ? 'Cell__fill' : ''}></div>
			</div>
		);
	}
}

class Controll extends Component {
	render() {
		return (
			<div className="Controll">
				<div className="Controll_size">
					<div>
						<div>Col</div>
						<input type="text" ref="col"/>
					</div>
					<div>
						<div>Row</div>
						<input type="text" ref="row"/>
					</div>
					<button onClick={() => {
						let col = Number(this.refs.col.value)
						let row = Number(this.refs.row.value)
						State.coll = col
						State.row = row
						fetch(`${Host}/game/${col}/${row}`,
						{ method: 'POST' })
						.then(res => res.json())
						.then(body => {
							fetch(`${Host}/state`,{ method: 'POST' })
							.then(res => res.json())
							.then(body => State.updateState(body.State))
						})
					}}>Create</button>
				</div>
				<div className="Controll_move">
				<button onClick={() => {
					fetch(`${Host}/step`,
					{ method: 'POST' })
					.then(res => res.json())
					.then(body => {
						fetch(`${Host}/state`,{ method: 'POST' })
						.then(res => res.json())
						.then(body => State.updateState(body.State))
					})
				}}>Next</button>
				<button onClick={() => {
					this._lifeTimer = setInterval(() => {
						fetch(`${Host}/step`,
						{ method: 'POST' })
						.then(res => res.json())
						.then(body => {
							fetch(`${Host}/state`,{ method: 'POST' })
							.then(res => res.json())
							.then(body => State.updateState(body.State))
						})
					}, 200)
				}}>Start</button>
				<button onClick={() => {
					clearInterval(this._lifeTimer)
				}}>Stop</button>
				</div>

			</div>
		);
	}
}


export default App;
