# Simple I18n React [![CircleCI](https://circleci.com/gh/prageeth/node-js-boilerplate.svg?style=svg)](https://circleci.com/gh/prageeth/node-js-boilerplate)

React component for i18n translations using [@prageeth/simple-i18n](https://github.com/prageeth/simple-i18n).
This supports translations to have HTML tags that are safe to use (by avoiding updating the DOM html directly, disabling XSS).

## Installation

Note, this module has a peer-dependency with `@prageeths/simple-i18n`. We decided to do that as this is an extension of `@prageeths/simple-i18n` for react and we don't want to double-include the dependency in the distrubition.

```
npm install @prageeths/simple-i18n-react @prageeths/simple-i18n
```

## Getting started

For usage information of `@prageeths/simple-i18n`, please checkout the [github repo](https://github.com/prageeth/simple-i18n).

## Translations

```
// ES5
var Translate = require('@prageeths/simple-i18n-react');

// ES6
import Translate from '@prageeths/simple-i18n-react';

// assuming i18n translations are already setup using SimpleI18n as below:
const languages = {
   'en': {
      'help-info.body': 'Lorem ipsum'
   }
};

// let's create a simple component
const HelpInfo = () => (
  <div className="help-info">
    <Translate i18nKey="help-info.body" />
  </div>
);
```

## Dynamic variables

```
// assuming i18n translations are already setup using SimpleI18n as below:
const languages = {
   'en': {
      'profile-header.greeting': 'Hi {firstName}'
   }
};

// let's create a simple component
const ProfileHeader = ({ user }) => (
  <div className="profile-header">
    <Translate i18nKey="profile-header.greeting" options={{ firstName: user.first_name }} />
  </div>
);
```

## HTML tags

You are allowed to use basic HTML tags in the translations, with basic attributes. Attributes will be passed to the elements as props, so don't forget to use `className` instead of `class` for CSS classes.

```
const languages = {
   'en': {
      'help-info.body': 'For more information, visit our <a href="http://my-support.com">support page</a><br />Don\'t forget to leave us an amazing <strong className="red-text">review</strong>.'
   }
};

// let's create a simple component
const HelpInfo = () => (
  <div className="help-info">
    <Translate i18nKey="help-info.body" />
  </div>
);

// when rendered, will generate
<div class="help-info">
  For more information, visit our <a href="#">support page</a>
  <br />
  Don\'t forget to leave us an amazing <strong class="red-text">review</strong>.
</div>
```

***NOTE***
The link in the above example has been converted to a `#` when rendered, this is to prevent users accidentally clicking it and being redirected to another URL. In most cases, React applications will be a sinlge page application. In order to handle this link being clicked event, please see the [Link Click Handling](#link-click-handling)

***NOTE***
Illegal tags such as `script`, `iframe`, `img` are ignored and their content text will be displayed in the translation as static text:

```
'en': {
  ...
  'illegal-translation': 'I have some <script>alert('illegal');</script> translation'
  ...
};

// rendering 
<div className="illegal-example">
   <Translate i18nKey="illegal-translation" />
</div>

// will generate the following DOM with the content being static text
<div class="illegal-example">
  I have some alert('illegal'); translation
</div>
```

***NOTE***
Illegal attribtues such as any event handlers `onclick`, `onload`, `onkeypress` are ignored:

```
'en': {
  ...
  'illegal-attributes': 'I have some <div onClick="myClickHandler();">Click here</div> translation'
  ...
};

// rendering 
<div className="illegal-attribtues-example">
   <Translate i18nKey="illegal-attributes" />
</div>

// will generate the following DOM with no event handlers
<div class="illegal-attribtues-example">
  I have some <div>Click here</div> translation
</div>
```
You should not be using event handlers in translations. If you are in a situation that is required, then your code design is possibly flawed and is opening up to future issues. We recommend refactoring the approach.

## Link Click Handling

In general, applcations have their own way of handling link clicks. Such as opening on a new tab, etc. This can be initialised one time at the start of your application.

```
import Translate from '@prageeths/simple-i18n-react';

Translate.setDefaultLinkHandler(function(link) { // link was taken from 'href' attribute
   // my awesome way to handle the link click
   myAwesomeUrlClickHandler.open(link);
});

```

Now that you have already setup a general link handler, perhaps you want to change the way a single link works compared to the rest of the links:

```
const languages = {
   'en': {
      'feedback.body': 'Please leave us some <a href="feedback-handler">feedback</a>.'
   }
};

// my custom click handler
var myFeedbackClickHandler = function() {
  // open feedback popup
};

// let's create a simple component, but override the default link handler just for this component
const HelpInfo = () => (
  <div className="feedback-section">
    <Translate i18nKey="feedback.body" onLinkClick={myFeedbackClickHandler} />
  </div>
);

```
***NOTE*** In the above example, in order for link handling to be triggered when a user clicks on the link, we had to set `href` to something other than empty string or `#`. If `href` is not provided, is empty or set to `#`, the click handling is ignored.
