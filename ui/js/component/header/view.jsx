import React from 'react';
import {
  Icon,
  CreditAmount,
} from 'component/common.js';
import lbry from 'lbry'
import Link from 'component/link';

var Header = React.createClass({
  _balanceSubscribeId: null,
  _isMounted: false,

  getInitialState: function() {
    return {
      balance: 0
    };
  },
  componentDidMount: function() {
    this._isMounted = true;
    this._balanceSubscribeId = lbry.balanceSubscribe((balance) => {
      if (this._isMounted) {
        this.setState({balance: balance});
      }
    });
  },
  componentWillUnmount: function() {
    this._isMounted = false;
    if (this._balanceSubscribeId) {
      lbry.balanceUnsubscribe(this._balanceSubscribeId)
    }
  },
  render: function() {
    return <header id="header">
        <div className="header__item">
          <Link onClick={() => { lbry.back() }} button="alt button--flat" icon="icon-arrow-left" />
        </div>
        <div className="header__item">
          <Link href="#" onClick={() => this.props.navigate('discover')} button="alt button--flat" icon="icon-home" />
        </div>
        <div className="header__item header__item--wunderbar">
          <WunderBar address={this.props.address} icon={this.props.wunderBarIcon} onSearch={this.props.onSearch} />
        </div>
        <div className="header__item">
          <Link href="#" onClick={() => this.props.navigate('wallet')} button="text" icon="icon-bank" label={lbry.formatCredits(this.state.balance, 1)} ></Link>
        </div>
        <div className="header__item">
          <Link button="primary button--flat" href="#" onClick={() => this.props.navigate('publish')} icon="icon-upload" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="#"  onClick={() => this.props.navigate('downloaded')} icon="icon-folder" />
        </div>
        <div className="header__item">
          <Link button="alt button--flat" href="#"  onClick={() => this.props.navigate('settings')} icon="icon-gear" />
        </div>
      </header>
  }
});

let WunderBar = React.createClass({
  _userTypingTimer: null,
  _input: null,
  _stateBeforeSearch: null,

  propTypes: {
    onSearch: React.PropTypes.func.isRequired
  },

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

    let searchTerm = event.target.value;

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
      icon: "icon-search",
      isActive: true
    }
    // this._input.value = ""; //trigger placeholder
    this._focusPending = true;
    //below is hacking, improved when we have proper routing
    if (!this.state.address.startsWith('lbry://') && this.state.icon !== "icon-search") //onFocus, if they are not on an exact URL or a search page, clear the bar
    {
      newState.address = '';
    }
    this.setState(newState);
  },
  onBlur: function() {
    this.setState(Object.assign({}, this._stateBeforeSearch, { isActive: false }));
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
    return (
      <div className={'wunderbar' + (this.state.isActive ? ' wunderbar--active' : '')}>
        {this.state.icon ? <Icon fixed icon={this.state.icon} /> : '' }
        <input className="wunderbar__input" type="search"
               ref={this.onReceiveRef}
               onFocus={() => this.props.activateSearch()}
               onBlur={() => this.props.deactivateSearch()}
               onChange={this.onChange}
               value={this.state.address}
               placeholder="Find movies, music, games, and more" />
      </div>
    );
  }
})

export default Header;
