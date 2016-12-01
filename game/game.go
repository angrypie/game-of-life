package main

import (
	"sync"
)

type Game struct {
	Columns   int
	Rows      int
	n         int
	State     []int
	nextState []int
}

func NewGame(columns, rows int) *Game {
	n := columns * rows
	return &Game{
		Columns:   columns,
		Rows:      rows,
		n:         n,
		State:     make([]int, n),
		nextState: make([]int, n),
	}
}

func (game *Game) InvertCell(n int) bool {
	game.State[n] = 1 - game.State[n]
	return true
}

func (game *Game) ProcessNextStep() {
	copy(game.nextState, game.State)
	game.AsyncCompute(2)
	copy(game.State, game.nextState)
}

func (game *Game) ProcessNextStep_v2(threads int) {
	copy(game.nextState, game.State)
	game.AsyncCompute(threads)
	copy(game.State, game.nextState)
}

func (game *Game) AsyncCompute(threads int) {
	block := game.n / threads
	var wg sync.WaitGroup
	wg.Add(threads)
	for i := 0; i < threads; i++ {

		go func(start, end int) {
			defer wg.Done()

			for j := start; j < end; j++ {
				game.checkCell(j)
			}

		}(i*block, (i+1)*block)

	}
	wg.Wait()
}

func (game *Game) checkCell(i int) {
	state := game.State
	n := game.n
	c := game.Columns
	r := game.Rows

	helper := func(cond bool, offset int, state []int) int {
		if cond {
			return state[offset]
		}
		return 0
	}

	sum := 0
	sum += helper(i-r >= 0, i-r, state)
	sum += helper(i+r < n, i+r, state)
	sum += helper(i+1 < n && i%c != c-1, i+1, state)
	sum += helper(i-1 >= 0 && i%c != 0, i-1, state)
	sum += helper(i-r >= 0 && i-1 >= 0 && i%c != 0, i-1-r, state)
	sum += helper(i-r >= 0 && i+1 < n && i%c != c-1, i+1-r, state)
	sum += helper(i+r < n && i-1 >= 0 && i%c != 0, i+r-1, state)
	sum += helper(i+r < n && i+1 < n && i%c != c-1, i+r+1, state)

	if sum == 3 && state[i] == 0 {
		game.nextState[i] = 1
	}

	if sum <= 1 || sum >= 4 {
		game.nextState[i] = 0

	}
}
