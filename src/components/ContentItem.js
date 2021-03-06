import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import CircularProgress from 'components/CircularProgress';
import extractDesc from 'utils/helpers/extractDesc';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import IconSms from 'material-ui/svg-icons/notification/sms';
import IconReply from 'material-ui/svg-icons/content/reply';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Author from './Author';
import VoteButton from 'features/Vote/VoteButton';
import {
  calculateContentPayout,
  displayContentNbComments,
  formatAmount,
} from 'utils/helpers/steemitHelpers';
import { COLOR, COLOR_HOVER, COLOR_LIGHT_TEXT, SIZE_SMALL } from 'styles/icons';

function ContentItem(props) {
  const { content, type, currentCategory } = props;
  const payout = calculateContentPayout(content);
  const splitUrl = content.url.split('#');
  const linkUrl = splitUrl[0];
  const hashUrl = splitUrl[1] ? `#${splitUrl[1]}` : '';
  const isResteemed = content.reblogged_by.length > 0;
  const resteemedBy = content.reblogged_by[0];
  return (
    <div className="post_card">
      {type === 'post' && content.main_img && (
        <Link
          to={{ pathname: linkUrl, hash: hashUrl }}
          className="post_card__block post_card__block--img"
          style={{background: `url(${content.main_img}) no-repeat #eee center center / cover`}}
        />
      )}
      <div className={`post_card__block post_card__block--content ${!content.main_img && 'full'}`}>
        <div className="title">
          <Link to={{ pathname: linkUrl, hash: hashUrl }} className="post_card__block">
            <h3>{content.title || content.root_title}</h3>
          </Link>
          {isResteemed && (
            <div className="resteemed">
              <Chip labelColor={COLOR_LIGHT_TEXT}>
                <Avatar>
                  <IconReply color="white" style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
                </Avatar>
                Resteemed by {' '}<Link to={`/@${resteemedBy}`}>{resteemedBy}</Link>
              </Chip>
            </div>
          )}
        </div>
        <Link to={{ pathname: linkUrl, hash: hashUrl }} className="post_card__block">
          <p>{extractDesc(content)}</p>
        </Link>
        <div className="post_card__block post_card__block--info">
          <div className="details">
            <VoteButton content={content} type={type} />
            <div className="price">
              {content.isUpdating && <CircularProgress size={20} thickness={3} style={{ marginRight: 10 }} />}
              {formatAmount(payout)}
            </div>
            <Link to="/" title="Favorites" className="social_area social_area--like">
              <IconFavorite color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{content.net_votes}</span>
            </Link>
            <Link title="Responses" to={{ pathname: linkUrl, hash: hashUrl }} className="social_area social_area--comment">
              <IconSms color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{displayContentNbComments(content)}</span>
            </Link>
          </div>
          <div className="info">
            <div className="author">
              <span>by </span>
              <Author name={content.author} reputation={content.author_reputation} />
            </div>
            <div className="datetime">
              <FormattedRelative value={`${content.created}Z`} /> in <Link to={`/${currentCategory}/${content.category}`}>{content.category}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ContentItem.defaultProps = {
  currentCategory: 'trending',
};

ContentItem.propTypes = {
  type: PropTypes.oneOf([
    'post', 'comment',
  ]).isRequired,
  content: PropTypes.object.isRequired,
  currentCategory: PropTypes.string,
};

export default ContentItem;