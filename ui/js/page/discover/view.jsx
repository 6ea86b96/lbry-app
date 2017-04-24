import React from 'react';
import lbry from 'lbry.js';
import lbryio from 'lbryio.js';
import lbryuri from 'lbryuri.js';
import lighthouse from 'lighthouse.js';
import FileTile from 'component/fileTile';
import {
  FileTileStream,
} from 'component/fileTileStream'
import Link from 'component/link';
import {ToolTip} from 'component/tooltip.js';
import {BusyMessage} from 'component/common.js';

const fetchResultsStyle = {
  color: '#888',
  textAlign: 'center',
  fontSize: '1.2em'
};

const SearchActive = (props) => {
  return (
    <div style={fetchResultsStyle}>
      <BusyMessage message="Looking up the Dewey Decimals" />
    </div>
  )
}

const searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

const SearchNoResults = (props) => {
  const {
    query,
  } = props

  return (
    <section style={searchNoResultsStyle}>
      <span style={searchNoResultsMessageStyle}>No one has checked anything in for {query} yet.</span>
      <Link label="Be the first" href="?publish" />
    </section>
  )
}

var SearchResults = React.createClass({
  render: function() {
    var rows = [],
        seenNames = {}; //fix this when the search API returns claim IDs

    for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of this.props.results) {
      const uri = lbryuri.build({
        channelName: channel_name,
        contentName: name,
        claimId: channel_id || claim_id,
      });

      rows.push(
        <FileTileStream key={name} uri={uri} outpoint={txid + ':' + nout} metadata={claim.stream.metadata} contentType={claim.stream.source.contentType} />
      );
    }
    return (
      <div>{rows}</div>
    );
  }
});

const communityCategoryToolTipText = ('Community Content is a public space where anyone can share content with the ' +
'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
'"five" to put your content here!');

const FeaturedCategory = (props) => {
  const {
    category,
    resolvedUris,
    names,
  } = props

  return (
    <div className="card-row card-row--small">
      <h3 className="card-row__header">{category}
        {category &&
          <ToolTip label="What's this?" body={communityCategoryToolTipText} className="tooltip--header" />}
      </h3>
      {names && names.map(name => <FileTile key={name} displayStyle="card" uri={name} />)}
    </div>
  )
}

const FeaturedContent = (props) => {
  const {
    featuredContentByCategory,
    resolvedUris,
  } = props

  const categories = Object.keys(featuredContentByCategory)

  return (
    <div>
      {categories.map(category =>
        <FeaturedCategory key={category} category={category} names={featuredContentByCategory[category]} resolvedUris={resolvedUris} />
      )}
    </div>
  )
}

const DiscoverPage = (props) => {
  const {
    searching,
    query,
    results,
  } = props

  return (
    <main>
      <FeaturedContent {...props} />
      { searching ? <SearchActive /> : null }
      { !searching && query && results.length ? <SearchResults results={results} /> : null }
      { !searching && query && !results.length ? <SearchNoResults query={query} /> : null }
    </main>
  );
}

// var DiscoverPage = React.createClass({
//   userTypingTimer: null,

//   propTypes: {
//     showWelcome: React.PropTypes.bool.isRequired,
//   },

//   componentDidUpdate: function() {
//     if (this.props.query != this.state.query)
//     {
//       this.handleSearchChanged(this.props.query);
//     }
//   },

//   getDefaultProps: function() {
//     return {
//       showWelcome: false,
//     }
//   },

//   componentWillReceiveProps: function(nextProps, nextState) {
//     if (nextProps.query != nextState.query)
//     {
//       this.handleSearchChanged(nextProps.query);
//     }
//   },

//   handleSearchChanged: function(query) {
//     this.setState({
//       searching: true,
//       query: query,
//     });

//     lighthouse.search(query).then(this.searchCallback);
//   },

//   handleWelcomeDone: function() {
//     this.setState({
//       welcomeComplete: true,
//     });
//   },

//   componentWillMount: function() {
//     document.title = "Discover";

//     if (this.props.query) {
//       // Rendering with a query already typed
//       this.handleSearchChanged(this.props.query);
//     }
//   },

//   getInitialState: function() {
//     return {
//       welcomeComplete: false,
//       results: [],
//       query: this.props.query,
//       searching: ('query' in this.props) && (this.props.query.length > 0)
//     };
//   },

//   searchCallback: function(results) {
//     if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
//     {
//       this.setState({
//         results: results,
//         searching: false //multiple searches can be out, we're only done if we receive one we actually care about
//       });
//     }
//   },

//   render: function() {
//     return (
//       <main>
//         <FeaturedContent {...this.props} />
//         { this.state.searching ? <SearchActive /> : null }
//         { !this.state.searching && this.props.query && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
//         { !this.state.searching && this.props.query && !this.state.results.length ? <SearchNoResults query={this.props.query} /> : null }
//       </main>
//     );
//   }
// });

export default DiscoverPage;
