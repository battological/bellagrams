import React from 'react';
import ReactDOM from 'react-dom';
import Puzzle from './components';
import quotes from './quotes';
import './index.css';


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.NONE_CHAR = '   ';
    this.state = this.getStateForQuote(0);
  }

  changeChar(charSettings) {
    const won = !(new Set(Object.keys(charSettings).map(char => charSettings[char] === char))).has(false);
    this.setState({
      charSettings: charSettings,
      won: won,
    });
  }

  getStateForQuote(nextQuote) {
    const quote = nextQuote;
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const words = quotes[quote]['quote'].toUpperCase().split(' ').map(word => word.split(''));

    const charSettings = {};
    words.forEach(word => {
      word.forEach(char => {
        charSettings[char] = abc.indexOf(char) > -1 ? this.NONE_CHAR : char;
      });
    });

    const inputRefs = words.map(word => word.filter(c => abc.indexOf(c) > -1).map(c => React.createRef()));

    return {
      words: words,
      charSettings: charSettings,
      quote: quote,
      won: false,
      inputRefs: inputRefs,
      author: quotes[quote].author,
      genre: quotes[quote].genre,
    };
  }

  next() {
    this.setState(this.getStateForQuote(this.state.quote + 1));

    const ref = this.state.inputRefs[0][0].current;
    ref.focus();
    ref.select();
  }

  render() {
    return (
      <div id='game'>
        {
          this.state.won && 
            <div id='next-message'>
              Correct! <a id='next' onClick={() => this.next()}>Next>></a>
            </div>
        }
        <Puzzle 
          NONE_CHAR={this.NONE_CHAR}
          author={this.state.author}
          changeChar={(charSettings) => this.changeChar(charSettings)}
          charSettings={this.state.charSettings}
          genre={this.state.genre}
          handleWin={() => this.handleWin()}
          inputRefs={this.state.inputRefs}
          won={this.state.won}
          words={this.state.words}
         />
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
