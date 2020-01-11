import React from 'react';
import i18n from '@pureartisan/simple-i18n';

import { isVoidTag, isIllegalTag, isLinkTag } from './helpers';

export const Element = ({ tag, attr = {}, text, options, linkHandler }) => {

  if (isIllegalTag(tag)) {
    // remove tag, but process the content
    return (
      <React.Fragment>
        {i18n.process(text, options)}
      </React.Fragment>
    )
  }

  const Component = tag || React.Fragment;

  if (isVoidTag(tag)) {
    // no children, only the attributes
    return (<Component {...attr} />);
  }

  if (isLinkTag(tag)) {
    if (attr.href && attr.href !== '#') {
      if (linkHandler) {
        const link = attr.href;
        attr.onClick = (e) => {
          e.stopPropagation();
          linkHandler.handle(link);
        };
      }
      attr.href = '#';
    }
  }

  return (
    <Component {...attr}>
      {i18n.process(text, options)}
    </Component>
  );

};
