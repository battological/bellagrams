import React from 'react';
import shuffle from 'shuffle-array';


export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);

    this.NONE_CHAR = '   ';

    this.abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.shuffledAbc = shuffle(this.abc, { 'copy': true });

    this.chars = props.quote['quote'].toUpperCase().split('');
    this.words = props.quote['quote'].toUpperCase().split(' ').map(word => word.split(''));
    const charSettings = {};
    this.chars.forEach((char, i) => {
      charSettings[char] = this.abc.indexOf(char) > -1 ? this.NONE_CHAR : char;
    });

    this.inputRefs = this.words.map(word => word.filter(c => this.abc.indexOf(c) > -1).map(c => React.createRef()));

    this.state = {
      charSettings: charSettings,
    };
  }

  shuffledChar(char) {
    const pos = this.abc.indexOf(char);
    return pos > -1 ? this.shuffledAbc[pos] : char;
  }

  handleCharChange(wordI, charJ, newSetting) {
    const char = this.words[wordI][charJ];
    newSetting = newSetting.toUpperCase();

    const charSettings = Object.assign({}, this.state.charSettings, {[char]: newSetting});
    this.setState({
      charSettings: charSettings,
    });

    const getNextInputRef = () => {
      for (let i=0; i < this.words.length; i++) {
        for (let j=0; j < this.words[i].length; j++) {
          if (charSettings[this.words[i][j]] === this.NONE_CHAR) {
            return this.inputRefs[i][j].current;
          }
        }
      }
      return this.inputRefs[0][0].current;
    }
    const inputRef = getNextInputRef();
    inputRef.focus();
    inputRef.select();

    const won = !(new Set(this.chars.map(char => charSettings[char] === char))).has(false);
    if (won) {
      this.props.handleWin();
    }
  }

  componentDidMount() {
    this.inputRefs[0][0].current.focus();
    this.inputRefs[0][0].current.select();
  }

  render() {
    const status = this.state.won ? "That's right!" : '';
    return (
      <div id='puzzle'>
        <h2>{this.props.quote['author']}</h2>
        <h3>{this.props.quote['genre']}</h3>
        <div id='status'>{status}</div>
        <div id='words'>
            {
              this.words.map((word, i) => {
                return (
                  <div className='word' key={i}>
                    {
                      word.map((char, j) => {
                        if (this.abc.indexOf(char) > -1) {
                          return (
                            <Character
                              key={j}
                              crypt={this.shuffledChar(char)}
                              current={this.state.charSettings[char]}
                              onChange={(newSetting) => this.handleCharChange(i, j, newSetting)}
                              canChange={!this.props.won}
                              inputRef={this.inputRefs[i][j]}
                            />
                          );
                        } else {
                          return <PlainCharacter key={j} char={char} />
                        }
                      })
                    }
                  </div>
                );
              })
            }
        </div>
      </div>
    );
  }
}

function PlainCharacter(props) {
  return (
    <div className='plain-char' ref={props.inputRef}>
      {props.char === ' ' ? '\u00A0' : props.char}
    </div>
  );
}

class Character extends React.Component {
  handleInput(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div className='char'>
        <input
          type='text'
          disabled={!this.props.canChange}
          ref={this.props.inputRef}
          onChange={(e) => this.handleInput(e)}
          value={this.props.current}
          maxLength='1'
        />
        <hr />
        <span>{this.props.crypt}</span>
      </div>
    );
  }
}
