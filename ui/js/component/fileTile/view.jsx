import React from 'react';
import lbry from 'lbry.js';
import lbryuri from 'lbryuri.js';
import Link from 'component/link';
import FileCardStream from 'component/fileCardStream'
import FileTileStream from 'component/fileTileStream'
import FileActions from 'component/fileActions';

class FileTile extends React.Component {
  render() {
    const {
      displayStyle,
      uri,
      claim,
      showEmpty,
    } = this.props

    if(!claim) {
      if (displayStyle == 'card') {
        return <FileCardStream uri={uri} />
      }
      return null
    }

    if (showEmpty) {
      return <div className="empty">Empty file tile for {uri}</div>
    }

    return displayStyle == 'card' ?
      <FileCardStream uri={uri} />
      :
      <FileTileStream uri={uri} key={uri} />
  }
}

export default FileTile
