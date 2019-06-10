import React from 'react';
import './App.css';

let board = [];
let game_is_over = false;
let players_in_game = [];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {tiles: [
      '0-0', '0-1', '0-2', '0-3', '0-4', '0-5', '0-6',
      '1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '2-2',
      '2-3', '2-4', '2-5', '2-6', '3-3', '3-4', '3-5',
      '3-6', '4-4', '4-5', '4-6', '5-5', '5-6', '6-6'],
      board: [],
      players_tiles: [],
    }
    this.distributeTiles = this.distributeTiles.bind(this);
  }

  distributeTiles() {
    let tiles = [];
    let newTiles = this.state.tiles.slice();

		for(let x = 0; x < 7; x++){
			let indexTile = Math.floor(Math.random() * newTiles.length);
      tiles.push(newTiles[indexTile]);
      newTiles.splice(indexTile, 1);
    }

    let players = [...this.state.players_tiles];

    if(players.length < 4){

      players.push(tiles);
      this.setState(state => ({
        players_tiles:  players,
        tiles: newTiles
      }));
    }
	};

  createPlayer() {
    this.distributeTiles();

  }


  /* RENDER SECTION */
  renderTile(topValue, bottomValue, css_class) {
    let tile = topValue.toString().concat("-", bottomValue.toString());
    return (
      <Tile id={tile} css_class={css_class} key={tile} topValue={topValue} bottomValue={bottomValue}/>
    );
  }

  renderPlayer(name, tiles, turn){
    return(
      <Player key={name} name={name} tiles={tiles} turn={turn}/>
    );
  }

  renderInitialBoard() {
    return (
      <div>
        <div className="App">
          {
            this.state.tiles.map((tile, index) =>
            this.renderTile(this.state.tiles[index][0],
            this.state.tiles[index][2], "TileLine"))
          }
          <button onClick={() => this.createPlayer()}>Create Players</button>
        </div>
        <div className="App">
          HEY
        </div>
      </div>
    );
  }

  render(){
    if(this.state.players_tiles.length === 0){
      return(
        this.renderInitialBoard()
      );
    }
    else {
      return (
        <div>
          <div className="App">
            {
              this.state.tiles.map((tile, index) =>
              this.renderTile(this.state.tiles[index][0],
              this.state.tiles[index][2], "TileLine"))
            }
            <button onClick={() => this.createPlayer()}> Create Players</button>
            <button onClick={() => this.createPlayer()}> Start Game</button>

            {
                this.state.players_tiles.map((tiles, index) =>
                this.renderPlayer("Player ".concat((index+1).toString()), tiles))
            }
          </div>
          <div className="App">
          {
            board.map((tile, index) =>
            this.renderTile(board[index][0],
            board[index][2], "TileLine_in_board"))
          }
          </div>
        </div>
      );
    }
  }
}


class Player extends React.Component {
  constructor(props){
    super(props);
    //this.setTiles = this.setTiles.bind(this);
    this.state = {name: this.props.name, tiles: this.props.tiles, turn: this.props.turn}
    this.moveTile = this.moveTile.bind(this);
    this.setTurn = this.setTurn.bind(this);
  }

  setTurn() {
    this.state(state => ({
      turn: true
    }));
  }

  verifyTiles(tile1, tile2, position){
  	let tilesMatch = false;
  	if(position === 0){
  		if(tile1[0] === tile2[2]){
  			return tile2;
  		}
  		else if(tile1[0] === tile2[0]){
  			return tile2.split('').reverse().join("");
  		}
  	}
  	else if(position === 1){
  		if(tile1[2] === tile2[0]){
  			return tile2;
  		}
  		else if(tile1[2] === tile2[2]){
  			return tile2.split('').reverse().join("");
  		}
  	}
  	return tilesMatch;
  }

  moveTile(tile) {
    if(!game_is_over && !this.state.turn){
      const tiles = this.state.tiles;
      //let board = this.state.board.slice();
      let foundTile = 0;

      if(tiles.indexOf(tile) > -1){
        foundTile = tile;
      }
      else if (tiles.indexOf(tile.split("").reverse().join()) > -1){
        foundTile = tile.split("").reverse().join();
      }

      if(foundTile){
        if(board.length === 0){
          board.push(foundTile);
          tiles.splice(tiles.indexOf(foundTile), 1);
        }
  			else{
  				if(this.verifyTiles(board[0], tile, 0)){
  					board.unshift(this.verifyTiles(board[0], tile, 0));
            tiles.splice(tiles.indexOf(foundTile), 1);
  				}
  				else if(this.verifyTiles(board[board.length-1], tile, 1)){
  					board.push(this.verifyTiles(board[board.length-1], tile, 1));
            tiles.splice(tiles.indexOf(foundTile), 1);
  				}
  			}
        this.setState(state => ({
          tiles: tiles, turn: false
        }));

        if(tiles.length === 0){
            game_is_over = true;
        }
        console.log(board);
      }
    }
  }

  renderTile(topValue, bottomValue, css_class) {
    let tile = topValue.toString().concat("-", bottomValue.toString());
    return (
      <Tile id={tile} css_class={css_class} key={tile} topValue={topValue} bottomValue={bottomValue}
      onClick={() => this.moveTile(tile)}/>
    );
  }

  render() {
    if(!game_is_over){
      return (
        <div>
          <h1>{this.state.name}</h1>
          {
            this.state.tiles.map((tile, index) =>
            this.renderTile(tile[0], tile[2], "TileLine"))
          }
          <button onClick={() => this.setState(state => ({turn: false}))}>Pass</button>
        </div>
      );
    }
    else {
      return(
        <div>
          <h1>{this.state.name} is the winner</h1>
        </div>
      );
    }
  }
}


class Tile extends React.Component{
  constructor(props){
    super(props);
    this.state = {topValue: this.props.topValue,
      bottomValue: this.props.bottomValue,
      board: []
      }
    this.invertValues = this.invertValues.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let board = [];
    board.push(this.state.topValue.toString().concat("-", this.state.bottomValue.toString()));
    this.setState(state => ({
      board: board
    }));
  }

  invertValues() {
    let _topValue = this.state.bottomValue;
    let _bottomValue = this.state.topValue;
    this.setState(state => ({
      topValue: _topValue,
      bottomValue: _bottomValue
    }));
    console.log(this.state.topValue.concat("-",this.state.bottomValue));
  }


  render() {
    return(
      <div id={this.props.id} className={this.props.css_class} onClick={this.props.onClick}>
        <TopTile value={this.state.topValue}/>
        <BottomTile value={this.state.bottomValue}/>
      </div>
    );
  }

}

function TopTile(props){
  let tiles = Array(parseInt(props.value)).fill(null);
  let positions = [[],["middle"], ["topleft", "bottomright"], ["middle", "topleft", "bottomright"],
                  ["topleft", "bottomright", "topright", "bottomleft"], ["topleft", "bottomright", "topright", "bottomleft", "middle"],
                  ["topleft", "bottomright", "topright", "bottomleft", "middleleft", "middleright"]];
  return (
    <div>
      <div className="TopTile Tile">
      {
          tiles.map((value, index) =>
            <div key={index} className={"circle ".concat(positions[tiles.length][index])}></div>
          )
      }
      </div>
    </div>
  );
}

function BottomTile(props){
  let tiles = Array(parseInt(props.value)).fill(null);
  let positions = [[""],["middle"], ["topleft", "bottomright"], ["middle", "topleft", "bottomright"],
                  ["topleft", "bottomright", "topright", "bottomleft"], ["topleft", "bottomright", "topright", "bottomleft", "middle"],
                  ["topleft", "bottomright", "topright", "bottomleft", "middleleft", "middleright"]];
  return (
    <div>
      <div className="BottomTile Tile">
          {
              tiles.map((value, index) =>
                <div key={index} className={"circle ".concat(positions[tiles.length][index])}></div>

              )

          }
      </div>
    </div>
  );
}

export default App;
