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
        console.log(this.state.value)
        this.state.handleWinFun(this.state.value, winner);
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
      active={this.state.activeBoard === i}
    />;
  }

  handleWinner(i, winner) {
      const boards = this.state.boards.slice();
      boards[i] = winner;
      this.setState({
        boards: boards,
      });
      console.log(boards)
      if (calculateWinner(boards)){
          this.setState({status: "GAME WON BY " + calculateWinner(boards)})
      }
  }

  handleClick(boardi, i) {
    let result;
    if (this.state.activeBoard === null || this.state.activeBoard === boardi){
      result = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        xIsNext: !this.state.xIsNext,
        activeBoard: i
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