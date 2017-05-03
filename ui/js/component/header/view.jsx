import React from 'react';
import lbryuri from 'lbryuri';
import {
  Icon,
  CreditAmount,
} from 'component/common.js';
import lbry from 'lbry'
import Link from 'component/link';

var Header = React.createClass({
  _balanceSubscribeId: null,
  _isMounted: false,

  propTypes: {
    onSearch: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },

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
          <WunderBar
            address={this.props.address}
            icon={this.props.wunderBarIcon}
            onSearch={this.props.onSearch}
            onSubmit={this.props.onSubmit}
            viewingPage={this.props.viewingPage}
          />
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
  _resetOnNextBlur: true,

  propTypes: {
    onSearch: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
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
      this._resetOnNextBlur = false;
      this.props.onSearch(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewingPage !== this.props.viewingPage || nextProps.address != this.props.address) {
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
    let commonState = {isActive: false};
    if (this._resetOnNextBlur) {
      this.setState(Object.assign({}, this._stateBeforeSearch, commonState));
      this._input.value = this.state.address;
    } else {
      this._resetOnNextBlur = true;
      this._stateBeforeSearch = this.state;
      this.setState(commonState);
    }
  },
  componentDidUpdate: function() {
    this._input.value = this.state.address;
    if (this._input && this._focusPending) {
      this._input.select();
      this._focusPending = false;
    }
  },
  onKeyPress: function(event) {
    if (event.charCode == 13 && this._input.value) {
      clearTimeout(this._userTypingTimer);
      this.props.onSubmit(lbryuri.normalize(this._input.value));
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
               onKeyPress={this.onKeyPress}
               value={this.state.address}
               placeholder="Find movies, music, games, and more" />
      </div>
    );
  }
})

export default Header;
