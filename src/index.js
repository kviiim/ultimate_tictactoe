import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={{ background: props.color, color: props.textColor}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      squares: Array(9).fill(null),
      handleClickFun: props.clickFunc,
      handleWinFun: props.winFunc,
      handleFullFun: props.fullFunc,
      activeColor: props.active,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ activeColor: (props.active ? "#99ecf7" : "#FFFFFF") })
  }

  handleClick(i) {
    let result;
    const squares = this.state.squares.slice();
    if (!squares[i]){
      result = this.state.handleClickFun(this.state.value, i);
      squares[i] = result;    

      const winner = calculateWinner(squares);
      if (winner != null){
        this.state.handleWinFun(this.state.value, winner);
      }

      const full = checkBoardFull(squares);
      if (full){
        this.state.handleFullFun(this.state.value);
      }

      this.setState({
        squares: squares,
      });
    }
  }

  renderSquare(i, winner) {
    return <Square 
      value={this.state.squares[i]} 
      color ={getColor(this.state.squares[i], winner)}
      textColor = {getTextColor(this.state.squares[i])}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);

    return (
      <div className="board" style={{ background:this.state.activeColor }}>
        <div className="squares-row">
          {this.renderSquare(0, winner)}
          {this.renderSquare(1, winner)}
          {this.renderSquare(2, winner)}
        </div>
        <div className="squares-row">
          {this.renderSquare(3, winner)}
          {this.renderSquare(4, winner)}
          {this.renderSquare(5, winner)}
        </div>
        <div className="squares-row">
          {this.renderSquare(6, winner)}
          {this.renderSquare(7, winner)}
          {this.renderSquare(8, winner)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: Array(9).fill(null),
      full_boards: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      activeBoard: null,
      status: null,
    }
  }

  renderBoard(i) {
    return <Board 
      value={i} 
      winFunc={this.handleWinner.bind(this)}
      clickFunc={this.handleClick.bind(this)}
      fullFunc={this.handleBoardFull.bind(this)}
      active={this.state.activeBoard === i}
    />;
  }

  handleWinner(i, winner) {
      const boards = this.state.boards.slice();
      boards[i] = winner;
      this.setState({
        boards: boards,
      });
      if (calculateWinner(boards)){
          this.setState({status: "GAME WON BY " + calculateWinner(boards)})
      }
  }

  handleBoardFull(i) {
    const full_boards = this.state.full_boards.slice();
    full_boards[i] = true;
    this.setState({
      full_boards: full_boards,
    });
  }

  handleClick(boardi, i) {
    let result;
    if (this.state.activeBoard === null || this.state.activeBoard === boardi){
      result = this.state.xIsNext ? 'X' : 'O';
      let active = this.state.full_boards[i] ? null : i;
      this.setState({
        xIsNext: !this.state.xIsNext,
        activeBoard: active,
      })
    }
    return result;
  }

  render() {
    return (
      <div className="game">
        <div className="status">  {this.state.status ? ("Winner: " + this.state.status + "!") : ("Player: " + (this.state.xIsNext ? 'X' : 'O'))}</div>
        <div className='board-row'>
          {this.renderBoard(0)}
          {this.renderBoard(1)}
          {this.renderBoard(2)}
        </div>
        <div className='board-row'>
          {this.renderBoard(3)}
          {this.renderBoard(4)}
          {this.renderBoard(5)}
        </div>        
        <div className='board-row'>
          {this.renderBoard(6)}
          {this.renderBoard(7)}
          {this.renderBoard(8)}
        </div>
      </div>
    );
  }
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function checkBoardFull(squares){
  for (let i=0; i < squares.length; i++){
    if (squares[i] !== 'X' && squares[i] !== 'O'){
      return false;
    }
  }
  return true;
}

function getColor(value, winner) {
  if ( winner === 'X'){
    return '#ffadff';
  }
  else if (winner === 'O'){
    return '#d6adff';
  }
  else {
    return '#ffffff';
  }
}

function getTextColor(value) {
  if (value === 'X'){
    return '#b821b8';
  }
  else if (value === 'O'){
    return '#722bba';
  }
  else {
    return '#ffffff';
  }
}