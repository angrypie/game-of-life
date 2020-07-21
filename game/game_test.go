package main

import (
	"testing"
)

func testStepProcess(cols, rows, steps, threads int) {
	game := NewGame(cols, rows)
	for i := 0; i < steps; i++ {
		game.ProcessNextStep_v2(threads)
	}
}

//func BenchmarkStepProcess1threads(b *testing.B) {
//testStepProcess(500, 500, 100, 1)
//}

//func BenchmarkStepProcess2threads(b *testing.B) {
//testStepProcess(500, 500, 100, 2)
//}

//func BenchmarkStepProcess3threads(b *testing.B) {
//testStepProcess(500, 500, 100, 3)
//}

func BenchmarkStepProcess4thredas(b *testing.B) {
	testStepProcess(1000, 1000, 100, 4)
}

func BenchmarkStepProcess8threads(b *testing.B) {
	testStepProcess(1000, 1000, 100, 1000)
}

func TestCheckGame(t *testing.T) {
	cols := 10
	rows := 10
	steps := 10

	game := NewGame(cols, rows)
	for i := 0; i < steps; i++ {
		game.ProcessNextStep()
	}
}
