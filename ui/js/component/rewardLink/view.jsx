import React from 'react';
import lbry from 'lbry'
import Modal from 'component/modal';
import rewards from 'rewards';
import Link from 'component/link'
import {
  BusyMessage,
  Icon,
} from 'component/common'

const RewardLink = (props) => {
  const {
    reward,
    claimed,
    button,
    pending,
    claimable = true,
    claimReward,
    errorMessage,
    clearError,
    currentlyClaimingReward,
  } = props
  const claiming = currentlyClaimingReward && currentlyClaimingReward === reward.reward_type

  let content
  if (claiming) {
    content = <BusyMessage message="Claiming" />
  } else if (claimed) {
    content = <span><Icon icon="icon-check" /> Reward claimed.</span>
  } else {
    content = <Link
      button={button ? button : 'alt'}
      disabled={pending || !claimable }
      label={ pending ? "Claiming..." : "Claim Reward"}
      onClick={() => { claimReward(reward) }}
    />
  }

  return (
    <div className="reward-link">
      {content}
      {errorMessage ?
       <Modal isOpen={true} contentLabel="Reward Claim Error" className="error-modal" onConfirmed={() => { clearError() }}>
         {errorMessage}
       </Modal>
        : ''}
    </div>
  )
}
export default RewardLink