import React from 'react';
import SettingsPage from 'page/settings.js';
import HelpPage from 'page/help';
import WatchPage from 'page/watch.js';
import ReportPage from 'page/report.js';
import StartPage from 'page/start.js';
import ClaimCodePage from 'page/claim_code.js';
import ReferralPage from 'page/referral.js';
import WalletPage from 'page/wallet.js';
import DetailPage from 'page/show.js';
import PublishPage from 'page/publish.js';
import DiscoverPage from 'page/discover.js';
import SplashScreen from 'component/splash.js';
import DeveloperPage from 'page/developer.js';
import {
  FileListDownloaded,
  FileListPublished
} from 'page/file-list.js';

const route = (page, routesMap) => {
  const component = routesMap[page]

  return component
};


const Router = (props) => {
  const {
    currentPage,
  } = props;

  return route(currentPage, {
    'settings': <SettingsPage {...props} />,
    'help': <HelpPage {...props} />,
    'watch': <WatchPage {...props} />,
    'report': <ReportPage {...props} />,
    'downloaded': <FileListDownloaded {...props} />,
    'published': <FileListPublished {...props} />,
    'start': <StartPage {...props} />,
    'claim': <ClaimCodePage {...props} />,
    'referral': <ReferralPage {...props} />,
    'wallet': <WalletPage {...props} />,
    'send': <WalletPage {...props} />,
    'receive': <WalletPage {...props} />,
    'show': <DetailPage {...props} />,
    'publish': <PublishPage {...props} />,
    'developer': <DeveloperPage {...props} />,
    'discover': <DiscoverPage {...props} />,
  })
}

export default Router
