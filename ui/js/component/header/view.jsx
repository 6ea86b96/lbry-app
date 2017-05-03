import React from 'react';
import {
  Icon,
  CreditAmount,
} from 'component/common.js';
import Link from 'component/link';

var Header = React.createClass({
  _balanceSubscribeId: null,

  getInitialState: function() {
    return {
      balance: 0
    };
  },
  componentDidMount: function() {
    this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
      this.setState({ balance: balance });
    });
  },
  componentWillUnmount: function() {
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  },
  render: function() {
    return <div>
      <header id="header">
        <div className="header__item">
          <Link onClick={() => { history.back() }} button="alt button--flat" icon="icon-arrow-left" />
        </div>
        <div className="header__item">
          <Link href="?discover" button="alt button--flat" icon="icon-home" />
        </div>
        <div className="header__item header__item--wunderbar">
          <WunderBar address={this.props.address} icon={this.props.wunderBarIcon} onSearch={this.props.onSearch} />
        </div>
        <div className="header__item">
          <Link href="?wallet" button="text" icon="icon-bank" label={lbry.formatCredits(this.state.balance, 1)} ></Link>
        </div>
        <div className="header__item">
          <Link button="primary button--flat" href="?publish" icon="icon-upload" label="Publish" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="?downloaded" icon="icon-folder" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="?settings" icon="icon-gear" />
        </div>
      </header>
      {this.props.links ?
       <SubHeader links={this.props.links} viewingPage={this.props.viewingPage} /> :
       ''}
    </div>
  }
});

let WunderBar = React.createClass({
  _userTypingTimer: null,
  _input: null,
  _stateBeforeSearch: null,

  getInitialState: function() {
    return {
      address: this.props.address,
      icon: this.props.icon
    };
  },
  componentWillUnmount: function() {
    if (this.userTypingTimer) {
      clearTimeout(this._userTypingTimer);
    }
  },
  onChange: function(event) {

    if (this._userTypingTimer)
    {
      clearTimeout(this._userTypingTimer);
    }

    this.setState({ address: event.target.value })

    //@TODO: Switch to React.js timing
    var searchTerm = event.target.value;

    this._userTypingTimer = setTimeout(() => {
      this.props.onSearch(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower

  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.state.address || nextProps.icon !== this.state.icon) {
      this.setState({ address: nextProps.address, icon: nextProps.icon });
    }
  },
  onFocus: function() {
    this._stateBeforeSearch = this.state;
    let newState = {
      icon: "icon-search"
    }
    // this._input.value = ""; //trigger placeholder
    this._focusPending = true;
    if (!this.state.address.match(/^lbry:\/\//)) //onFocus, if they are not on an exact URL, clear the bar
    {
      newState.address = "";
    }
    this.setState(newState);
  },
  onBlur: function() {
    this.setState(this._stateBeforeSearch);
    this._input.value = this.state.address;
  },
  componentDidUpdate: function() {
    this._input.value = this.state.address;
    if (this._input && this._focusPending) {
      this._input.select();
      this._focusPending = false;
    }
  },
  onReceiveRef: function(ref) {
    this._input = ref;
  },
  render: function() {
    return <div className="wunderbar">
      {this.state.icon ? <Icon fixed icon={this.state.icon} /> : '' }
      <input className="wunderbar__input" type="search" placeholder="Type a LBRY address or search term"
             ref={this.onReceiveRef}
             onFocus={() => this.props.activateSearch()}
             onBlur={() => this.props.deactivateSearch()}
             onChange={this.onChange}
             value={ this.state.address }
             placeholder="Find movies, music, games, and more" />
      </div>
  }
})

const SubHeader = (props) => {
  const {
    subLinks,
    currentPage,
    navigate,
  } = props

  const links = []

  for(let link of Object.keys(subLinks)) {
    links.push(
      <a href="#" onClick={() => navigate(link)} key={link} className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected' }>
        {subLinks[link]}
      </a>
    )
  }

  return (
    <nav className="sub-header">
      {links}
    </nav>
  )
}

export default Header;
