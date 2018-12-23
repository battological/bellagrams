import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './components';
import quotes from './quotes';
import './index.css';


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: 0,
      won: false,
    };
  }

  handleWin() {
    this.setState({
      won: true,
    });
  }

  next() {
    this.setState({
      quote: this.state.quote+1,
      won: false,
    });
  }

  render() {
    return (
      <div id='game'>
        {
          this.state.won && 
            <div id='next-message'>
              Correct!
              <a id='next' onClick={() => this.next()}>Next>></a>
            </div>
        }
        <Puzzle quote={quotes[this.state.quote]} won={this.state.won} handleWin={() => this.handleWin()} />
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
