import React from 'react';
import { shallow, configure as enzymeConfigure } from 'enzyme';
import { expect, use as chaiUse } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import EnzymeReactAdapter from 'enzyme-adapter-react-16';
import SimpleI18n from '@pureartisan/simple-i18n';

import { Element } from '../../src/element';
import { LinkHanlder } from '../../src/link-handler';
import { Translate, defaultLinkHandler } from '../../src/translate';
import * as Helpers from '../../src/helpers';

enzymeConfigure({ adapter: new EnzymeReactAdapter() });
chaiUse(sinonChai);

describe('Translate', () => {

    let splitByTagsStub;
    let i18nRaw;

    beforeEach(() => {
        splitByTagsStub = stub(Helpers, 'splitByTags').returns([]);
        i18nRaw = stub(SimpleI18n, 'raw');
    });

    afterEach(() => {
        splitByTagsStub.restore();
        i18nRaw.restore();
    });

    describe('render', () => {

      it('should render React.Fragment', () => {
          const props = {
            i18nKey: 'my-key'
          };

          const wrapper = shallow(<Translate {...props} />);
          expect(wrapper.find('Fragment')).to.have.lengthOf(1);
      });

      it('should render no children when text is empty', () => {
          const props = {
            i18nKey: 'my-key'
          };

          const wrapper = shallow(<Translate {...props} />);
          expect(wrapper.find('Fragment')).to.have.lengthOf(1);
      });

      it('should gets raw text from i18n using the given key and passes them to splitByTags', () => {
          const props = {
            i18nKey: 'my-key'
          };
          const dummyRawText = 'dummy-raw-text';

          i18nRaw.withArgs('my-key').returns(dummyRawText);

          const wrapper = shallow(<Translate {...props} />);
          expect(splitByTagsStub).to.have.been.calledOnce;
          expect(splitByTagsStub).to.have.been.calledWith(dummyRawText);
      });

      it('should render text as element', () => {
          const dummyOptions = {
            foo: 'bar'
          };

          const props = {
            i18nKey: 'my-key',
            options: dummyOptions
          };

          const dummyElement = {
            tag: 'span',
            attr: {
              className: 'my-class'
            },
            text: 'my-text'
          };

          splitByTagsStub.returns([ dummyElement ]);

          const wrapper = shallow(<Translate {...props} />);
          const translate = wrapper.find('Fragment');
          expect(translate).to.have.lengthOf(1);
          expect(translate.children()).to.have.lengthOf(1);

          const element = translate.find(Element);
          expect(element).to.have.lengthOf(1);
          expect(element.props()).to.deep.include({
            ...dummyElement,
            options: dummyOptions
          });
      });

      it('should render multiple children as multiple elements', () => {
        const dummyOptions = {
          foo: 'bar'
        };

        const props = {
          i18nKey: 'my-key',
          options: dummyOptions
        };

        const dummyElement1 = {
          tag: 'span',
          attr: {
            className: 'my-class21'
          },
          text: 'my-text-1'
        };
        const dummyElement2 = {
          tag: 'div',
          attr: {
            className: 'my-class-2'
          },
          text: 'my-text-2'
        };

        splitByTagsStub.returns([ dummyElement1, dummyElement2 ]);

        const wrapper = shallow(<Translate {...props} />);
        const translate = wrapper.find('Fragment');
        expect(translate).to.have.lengthOf(1);
        expect(translate.children()).to.have.lengthOf(2);

        const elements = translate.find(Element);
        expect(elements).to.have.lengthOf(2);

        expect(elements.at(0).props()).to.deep.include({
          ...dummyElement1,
          options: dummyOptions
        });

        expect(elements.at(1).props()).to.deep.include({
          ...dummyElement2,
          options: dummyOptions
        });

      });

    });

    describe('onLinkClick', () => {

      it('should use defaultLinkHandler if onLinkClick is not provided', () => {

        const props = {
          i18nKey: 'my-key'
        };

        splitByTagsStub.returns([{
          tag: 'a'
        }]);

        const wrapper = shallow(<Translate {...props} />);

        const element = wrapper.find(Element);
        expect(element).to.have.lengthOf(1);

        expect(element.prop('linkHandler')).to.equal(defaultLinkHandler);

      });

      it('should use new LinkHanlder if onLinkClick is provided', () => {

        const props = {
          i18nKey: 'my-key',
          onLinkClick: stub()
        };

        splitByTagsStub.returns([{
          tag: 'a'
        }]);

        const wrapper = shallow(<Translate {...props} />);

        const element = wrapper.find(Element);
        expect(element).to.have.lengthOf(1);

        expect(element.prop('linkHandler')).to.not.equal(defaultLinkHandler);
        expect(element.prop('linkHandler')).to.be.an.instanceOf(LinkHanlder);

      });

      it('should use same LinkHanlder for multiple links if onLinkClick is provided', () => {

        const handleLinkClick = stub();

        const props = {
          i18nKey: 'my-key',
          onLinkClick: handleLinkClick
        };

        splitByTagsStub.returns([{
          tag: 'a',
          text: 'link-1'
        }, {
          tag: 'a',
          text: 'link-2'
        }]);

        const wrapper = shallow(<Translate {...props} />);

        const element = wrapper.find(Element);
        expect(element).to.have.lengthOf(2);

        expect(element.at(0).prop('linkHandler')).to.not.equal(defaultLinkHandler);
        expect(element.at(0).prop('linkHandler')).to.be.an.instanceOf(LinkHanlder);

        expect(element.at(0).prop('linkHandler')).to.equal(element.at(1).prop('linkHandler'));

      });

      it('should call onLinkClick if tag is a link and the link is clicked', () => {

        const handleLinkClick = stub();

        const props = {
          i18nKey: 'my-key',
          onLinkClick: handleLinkClick
        };

        const dummyLink = 'http://my-link.com';
        splitByTagsStub.returns([{
          tag: 'a',
          attr: {
            href: dummyLink
          }
        }]);

        const wrapper = shallow(<Translate {...props} />);
        const element = wrapper.find(Element);
        element.prop('linkHandler').handle(dummyLink);

        expect(handleLinkClick).to.have.been.calledOnce;
        expect(handleLinkClick).to.have.been.calledWith(dummyLink);

      });

    });

    describe('setDefaultLinkHandler', () => {

      afterEach(() => {
        defaultLinkHandler.reset();
      })

      it('should set handler of defaultLinkHandler', () => {
          const myHandler = stub();
          Translate.setDefaultLinkHandler(myHandler);
          defaultLinkHandler.handle('some-link');
          expect(myHandler).to.have.been.calledOnce;
          expect(myHandler).to.have.been.calledWith('some-link');
      });

    });

});
