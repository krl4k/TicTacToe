import React from 'react';
// import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import './index.css';
import {queries} from "@testing-library/react";

function Square(props) {
    return (
       <button className="square" onClick={() => {props.onClick()}} style={{background: props.color}}>
           {props.value}
       </button>
    );
}


class Board extends React.Component {
    renderSquare(i, isRed = false) {
        return <
            Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            color={isRed === true ? '#F00000' : '#FFF000'}
        />;
    }

    render() {
        let rows = 3;
        let columns = 3;
        return (
            <div>
                {[...Array(rows).keys()].map(row => (
                <div className={"board-row"} key={row}>
                    {[...Array(columns).keys()].map(column => (
                        // this.props.winnerLine.map((e, index) =>
                            this.renderSquare(row * columns + column, this.props.winnerLine?.indexOf(row * columns + column) >= 0)
                        // )
                    ))}
                </div>
                ))}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).squares || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState(
            {
                stepNumber: step,
                xIsNext: (step % 2) === 0
            }
        );
    }

    restartGame() {
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        });
    }

    getTryAgainBtn(reason) {
        return (
            <div className={"Try again"}>
            <div>{reason}</div>
            <button onClick={() => this.restartGame()}>
                Try again
            </button>
        </div>
        )
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const res = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        let winnerLine;
        if (res.squares) {
            status =  this.getTryAgainBtn(`Winner: ${res.squares}`);
            winnerLine = res.winnerLine;
        } else if (this.state.stepNumber === 9) {
            status =  this.getTryAgainBtn(`Friendship won`);
        } else {
            status = 'Next : ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i)=>this.handleClick(i)}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                squares: squares[a],
                winnerLine: lines[i]
            };
        }
    }
    return {squares: null};
}

// ========================================

const root = createRoot(document.getElementById("root"));
root.render(<Game />);
