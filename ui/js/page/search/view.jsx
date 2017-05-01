import React from 'react';
import lbry from 'lbry';
import lbryio from 'lbryio';
import lbryuri from 'lbryuri';
import lighthouse from 'lighthouse';
import FileTile from 'component/fileTile'
import FileTileStream from 'component/fileTileStream'
import Link from 'component/link'
import {ToolTip} from 'component/tooltip';
import {BusyMessage} from 'component/common';

const fetchResultsStyle = {
  color: '#888',
  textAlign: 'center',
  fontSize: '1.2em'
}

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

const SearchResults = (props) => {
  const {
    results
  } = props

  const rows = [],
      seenNames = {}; //fix this when the search API returns claim IDs

  for (let {name, claim, claim_id, channel_name, channel_id, txid, nout} of results) {
    const uri = lbryuri.build({
      channelName: channel_name,
      contentName: name,
      claimId: channel_id || claim_id,
    });

    rows.push(
      <FileTileStream key={uri} uri={uri} />
    );
  }

  return (
    <div>{rows}</div>
  )
}

const SearchPage = (props) => {
  const isValidUri = (query) => true

  return (
    <main>
      { isValidUri(this.props.query) ?
        <div>
          <h3>lbry://{this.props.query}</h3>
          <div><BusyMessage message="Resolving the URL" /></div>
        </div> : '' }
      <h3>Search</h3>
      <SearchResults query={this.props.query} />
    </main>
  );
}

export default SearchPage
