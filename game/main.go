package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

var game *Game

func main() {
	server := echo.New()
	server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost",
			"http://10.0.1.10:8080",
		},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType},
	}))
	server.POST("/game/:cols/:rows", createGame)
	server.POST("/state", getState)
	server.POST("/state/:cell", invertCellState)
	server.POST("/step", nextStep)
	server.Logger.Fatal(server.Start(":9090"))

}

func createGame(c echo.Context) error {
	col, err := strconv.Atoi(c.Param("cols"))
	if err != nil {
		return err
	}
	row, err := strconv.Atoi(c.Param("rows"))
	if err != nil {
		return err
	}

	game = NewGame(col, row)
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"Success": true,
	})
}

func getState(c echo.Context) error {
	if game == nil {
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"Success": false,
		})
	}
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"Success": true,
		"State":   game.State,
	})
}

func invertCellState(c echo.Context) error {
	if game == nil {
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"Success": false,
		})
	}

	cell, err := strconv.Atoi(c.Param("cell"))
	if err != nil {
		return err
	}

	if !game.InvertCell(cell) {
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"Success": false,
		})
	} else {
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"Success": true,
			"State":   game.State,
		})
	}
}

func nextStep(c echo.Context) error {
	if game == nil {
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"Success": false,
		})
	}
	game.ProcessNextStep()
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"Success": true,
		"State":   game.State,
	})
}
