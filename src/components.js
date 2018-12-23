import React from 'react';
import shuffle from 'shuffle-array';


export default class Puzzle extends React.Component {
  constructor(props) {
    super(props);

    this.abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.shuffledAbc = shuffle(this.abc, { 'copy': true });
  }

  shuffledChar(char) {
    const pos = this.abc.indexOf(char);
    return pos > -1 ? this.shuffledAbc[pos] : char;
  }

  handleCharChange(wordI, charJ, newSetting) {
    const char = this.props.words[wordI][charJ];
    newSetting = newSetting.toUpperCase();

    const charSettings = Object.assign({}, this.props.charSettings, {[char]: newSetting});
    this.props.changeChar(charSettings);

    const getNextInputRef = () => {
      for (let i=0; i < this.props.words.length; i++) {
        for (let j=0; j < this.props.words[i].length; j++) {
          if (charSettings[this.props.words[i][j]] === this.props.NONE_CHAR) {
            return this.props.inputRefs[i][j].current;
          }
        }
      }
      return this.props.inputRefs[0][0].current;
    }
    const inputRef = getNextInputRef();
    inputRef.focus();
    inputRef.select();
  }

  componentDidMount() {
    this.props.inputRefs[0][0].current.focus();
    this.props.inputRefs[0][0].current.select();
  }

  render() {
    return (
      <div id='puzzle'>
        <h2>{this.props.author}</h2>
        <h3>{this.props.genre}</h3>
        <div id='status'>{status}</div>
        <div id='words'>
            {
              this.props.words.map((word, i) => {
                return (
                  <div className='word' key={i}>
                    {
                      word.map((char, j) => {
                        if (this.abc.indexOf(char) > -1) {
                          return (
                            <Character
                              key={j}
                              crypt={this.shuffledChar(char)}
                              current={this.props.charSettings[char]}
                              onChange={(newSetting) => this.handleCharChange(i, j, newSetting)}
                              canChange={!this.props.won}
                              inputRef={this.props.inputRefs[i][j]}
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
