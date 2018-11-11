
const REGEX_TAGS = /(<([A-Z][A-Z0-9]*)\b([^>]*)>(.*?)<\/\2>)|(<([A-Z][A-Z0-9]*)\b([^>]*)\/>)/gi;
const REGEX_ATTRS = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi;

const REGEX_ILLEGAL_TAGS = /^script|iframe|img$/gi;
const REGEX_VOID_TAGS = /^br$/gi;
const REGEX_LINK_TAGS = /^a$/gi;
const REGEX_ILLEGAL_ATTRIBUTES = /^on.+$/gi;

export function hasTags(str) {
  return str.indexOf('<') >= 0;
}

export function isTag(str) {
  return str.indexOf('<') === 0;
}

export function isVoidTag(tag) {
  return !!tag && !!tag.match(REGEX_VOID_TAGS);
}

export function isLinkTag(tag) {
  return !!tag && !!tag.match(REGEX_LINK_TAGS);
}

export function isIllegalTag(tag) {
  return !!tag && !!tag.match(REGEX_ILLEGAL_TAGS);
}

function _isIllegalAttr(attribute) {
  return attribute && attribute.match(REGEX_ILLEGAL_ATTRIBUTES);
}

export function extractAttributes(str) {
  const attr = {};
  let match = REGEX_ATTRS.exec(str);
  while (match != null) {
    const attribute = match[1];
    if (!_isIllegalAttr(attribute)) {
      attr[attribute] = match[2];
    }
    match = REGEX_ATTRS.exec(str);
  }
  return attr;
}

export function splitByTags(str) {

  if (!str || !str.length) {
    return [];
  }

  const list = [];

  let prev = 0;

  let match = REGEX_TAGS.exec(str);
  while (match != null) {

    if (prev < match.index) {
      list.push({
        text: str.substring(prev, match.index)
      });
    }
    const tag = match[2] || match[6];
    list.push({
      tag: tag.toLowerCase(),
      attr: extractAttributes(match[3] || match[7]),
      text: match[4]
    });
    prev = match.index + match[0].length;

    match = REGEX_TAGS.exec(str);

  }

  if (prev === null || prev < str.length) {
    list.push({
      text: str.substring(prev || 0)
    });
  }

  return list;

}
