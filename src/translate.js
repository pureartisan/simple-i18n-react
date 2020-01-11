import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@pureartisan/simple-i18n';

import { splitByTags } from './helpers';
import { Element } from './element';
import { LinkHanlder } from './link-handler';

const defaultLinkHandler = new LinkHanlder();

function getLinkHandler(callback) {
  if (callback) {
    const linkHandler = new LinkHanlder();
    linkHandler.setHandler(callback);
    return linkHandler;
  }
  return defaultLinkHandler;
}

const Translate = ({ i18nKey, options, onLinkClick }) => {
    const raw = i18n.raw(i18nKey);
    const linkHandler = getLinkHandler(onLinkClick);
    return (
        <React.Fragment>
            {splitByTags(raw).map((data, index) => (
                <Element
                  {...data}
                  options={options}
                  key={`${i18nKey}_${index}`}
                  linkHandler={linkHandler}
                />
            ))}
        </React.Fragment>
    );
};

Translate.propTypes = {
  i18nKey: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onLinkClick: PropTypes.func
};

Translate.defaultProps = {
  options: {}
};

Translate.setDefaultLinkHandler = (handler) => {
  defaultLinkHandler.setHandler(handler);
};

export {
  Translate,
  defaultLinkHandler
};
