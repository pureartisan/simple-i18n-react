import React from 'react';
import { shallow, configure as enzymeConfigure } from 'enzyme';
import { expect, use as chaiUse } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import EnzymeReactAdapter from 'enzyme-adapter-react-16';
import SimpleI18n from '@pureartisan/simple-i18n';

import { Element } from '../../src/element';
import { LinkHanlder } from '../../src/link-handler';
import * as Helpers from '../../src/helpers';

enzymeConfigure({ adapter: new EnzymeReactAdapter() });
chaiUse(sinonChai);

describe('Element', () => {

    let isVoidTagStub, isIllegalTagStub, isLinkTagStub;
    let i18nProcess;

    beforeEach(() => {
        isVoidTagStub = stub(Helpers, 'isVoidTag').returns(false);
        isIllegalTagStub = stub(Helpers, 'isIllegalTag').returns(false);
        isLinkTagStub = stub(Helpers, 'isLinkTag').returns(false);
        i18nProcess = stub(SimpleI18n, 'process');
    });

    afterEach(() => {
        isVoidTagStub.restore();
        isIllegalTagStub.restore();
        isLinkTagStub.restore();
        i18nProcess.restore();
    });

    describe('gerenal tag', () => {

      it('should render component of type tag', () => {
          const props = {
            tag: 'strong'
          };

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find('strong')).to.have.lengthOf(1);
      });

      it('should render processed text', () => {
          const dummyText = 'my-text';
          const dummyOptions = { foo: 'bar' };
          const dummyProcessedText = 'my-process-text';

          const props = {
            tag: 'strong',
            text: dummyText,
            options: dummyOptions
          };

          // children will be processed
          i18nProcess.withArgs(dummyText, dummyOptions).returns(dummyProcessedText);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find('strong').text()).to.equal(dummyProcessedText);
      });

      it('should render tag with attributes as props', () => {
          const props = {
            tag: 'strong',
            attr: {
              className: 'my-classname'
            }
          };
          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find('strong').prop('className')).to.equal('my-classname');
      });

    });

    describe('link tag', () => {

      it('should render link tag', () => {
          const linkTag = 'a';
          const props = {
            tag: linkTag
          };

          // tag is a link tag
          isLinkTagStub.withArgs(linkTag).returns(true);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find(linkTag)).to.have.lengthOf(1);
      });

      it('should render processed text', () => {
          const linkTag = 'a';
          const dummyText = 'my-text';
          const dummyOptions = { foo: 'bar' };
          const dummyProcessedText = 'my-process-text';

          const props = {
            tag: linkTag,
            text: dummyText,
            options: dummyOptions
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          // children will be processed
          i18nProcess.withArgs(dummyText, dummyOptions).returns(dummyProcessedText);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find(linkTag).text()).to.equal(dummyProcessedText);
      });

      it('should render tag with attributes as props', () => {
          const linkTag = 'a';

          const props = {
            tag: linkTag,
            attr: {
              className: 'my-classname'
            }
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find(linkTag).prop('className')).to.equal('my-classname');
      });

      it('should replace href attribute with "#"', () => {
          const linkTag = 'a';
          const props = {
            tag: linkTag,
            attr: {
              href: 'http://my-link.com'
            }
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find(linkTag).prop('href')).to.equal('#');
      });

      it('should call linkHandler when link is clicked', () => {
          const linkTag = 'a';
          const linkHref = 'http://my-link.com';
          const hanldeOnClick = stub();

          const linkHandler = new LinkHanlder();
          linkHandler.setHandler(hanldeOnClick);

          const props = {
            tag: linkTag,
            attr: {
              href: linkHref
            },
            linkHandler: linkHandler
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          const wrapper = shallow(<Element {...props} />);
          const link = wrapper.find(linkTag)
          expect(link.prop('onClick')).to.be.a('function');

          const fakeEvent = {
              stopPropagation: stub()
          };
          link.simulate('click', fakeEvent);
          expect(hanldeOnClick).to.have.been.calledOnce;
          expect(hanldeOnClick).to.have.been.calledWith(linkHref);
      });

      it('should not call linkHandler when link is clicked but provided href is "#" or empty', () => {
          const linkTag = 'a';
          const hanldeOnClick = stub();

          const linkHandler = new LinkHanlder();
          linkHandler.setHandler(hanldeOnClick);

          const props = {
            tag: linkTag,
            attr: {
              href: '#'
            },
            linkHandler: linkHandler
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          const wrapper = shallow(<Element {...props} />);
          const link = wrapper.find(linkTag)
          expect(link.prop('onClick')).to.be.undefined;

          link.simulate('click', {});
          expect(hanldeOnClick).to.have.not.been.called;
      });

      it('should not fail with no onLinkClick when link is clicked', () => {
          const linkTag = 'a';
          const props = {
            tag: linkTag,
            attr: {
              href: 'http://my-link.com'
            }
          };

          // tag is a link tag
          isLinkTagStub.returns(true);

          const wrapper = shallow(<Element {...props} />);
          const link = wrapper.find(linkTag)
          expect(link.prop('onClick')).to.be.undefined;

          expect(() => link.simulate('click')).to.not.throw();
      });

    });

    describe('illegal tag', () => {

      it('should render React.Fragment instead of tag', () => {
          const illegalTag = 'illegal_tag';
          const props = {
            tag: illegalTag
          };

          // tag is illegal
          isIllegalTagStub.withArgs(illegalTag).returns(true);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find('Fragment')).to.have.lengthOf(1);
          expect(wrapper.find(illegalTag)).to.have.lengthOf(0);
      });

      it('should render processed text', () => {

          const dummyText = 'my-text';
          const dummyOptions = { foo: 'bar' };
          const dummyProcessedText = 'my-process-text';

          const props = {
            text: dummyText,
            options: dummyOptions
          };

          // tag is illegal
          isIllegalTagStub.returns(true);

          // children will be processed
          i18nProcess.withArgs(dummyText, dummyOptions).returns(dummyProcessedText);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find('Fragment').text()).to.equal(dummyProcessedText);
      });

    });

    describe('void tag', () => {

      it('should render void tag without children', () => {

          const voidTag = 'br';

          const props = {
            tag: voidTag
          };

          // tag is void tag
          isVoidTagStub.withArgs(voidTag).returns(true);

          const wrapper = shallow(<Element {...props} />);

          const element = wrapper.find(voidTag);
          expect(element).to.have.lengthOf(1);

          expect(element.children()).to.be.empty;
          expect(element.text()).to.be.empty;
      });

      it('should render void tag with passed attributes as props', () => {
          const voidTag = 'br';

          const props = {
            tag: voidTag,
            attr: {
              foo: 'bar'
            }
          };

          // tag is void tag
          isVoidTagStub.withArgs(voidTag).returns(true);

          const wrapper = shallow(<Element {...props} />);
          expect(wrapper.find(voidTag).prop('foo')).to.equal('bar');
      });

    });

    describe('text element', () => {

        it('should render React.Fragment', () => {
            const props = {
              tag: undefined // only text, not a tag
            };
            const wrapper = shallow(<Element {...props} />);
            expect(wrapper.find('Fragment')).to.have.lengthOf(1);
        });

        it('should render processed text', () => {

            const dummyText = 'my-text';
            const dummyOptions = { foo: 'bar' };
            const dummyProcessedText = 'my-process-text';

            const props = {
              tag: undefined, // only text, not a tag
              text: dummyText,
              options: dummyOptions
            };

            // children will be processed
            i18nProcess.withArgs(dummyText, dummyOptions).returns(dummyProcessedText);

            const wrapper = shallow(<Element {...props} />);
            expect(wrapper.find('Fragment').text()).to.equal(dummyProcessedText);
        });

    });

});
