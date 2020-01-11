import React from 'react';
import { mount, configure as enzymeConfigure } from 'enzyme';
import { expect, use as chaiUse } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import EnzymeReactAdapter from 'enzyme-adapter-react-16';
import SimpleI18n from '@pureartisan/simple-i18n';

import { Element } from '../../src/element';
import { LinkHanlder } from '../../src/link-handler';
import { Translate, defaultLinkHandler } from '../../src/translate';

enzymeConfigure({ adapter: new EnzymeReactAdapter() });
chaiUse(sinonChai);

describe('Translate - Examples', () => {

    describe('text', () => {

      beforeEach(() => {
        setupI18n({
          'my-text': 'Hello World',
          'my-dynamic-text': 'Hi {firstName}'
        });
      });

      it('should display text', () => {

        const props = {
          i18nKey: 'my-text'
        };

        const wrapper = mount(<Translate {...props} />);
        expect(wrapper.find(Element)).to.have.lengthOf(1);
        // expect(wrapper.text()).to.equal('Hello World');
        // TODO expect failing due to bug in enzyme with React.Fragment

      });

      it('should display dynamic text', () => {

        const props = {
          i18nKey: 'my-dynamic-text',
          options: {
            firstName: 'Bob'
          }
        };

        const wrapper = mount(<Translate {...props} />);
        expect(wrapper.find(Element)).to.have.lengthOf(1);
        // expect(wrapper.text()).to.equal('Hi Bob');
        // TODO expect failing due to bug in enzyme with React.Fragment

      });

    });

    describe('typography tags', () => {

      beforeEach(() => {
        setupI18n({
          'my-strong-text': 'Hello <strong>World</strong>',
          'my-strong-dynamic-text': 'Hi <strong>{firstName}</strong>'
        });
      });

      it('should display tags', () => {

        const props = {
          i18nKey: 'my-strong-text'
        };

        const wrapper = mount(<Translate {...props} />);
        expect(wrapper.find(Element)).to.have.lengthOf(2);
        // expect(wrapper.text()).to.equal('Hello <strong>World</strong>');
        // TODO expect failing due to bug in enzyme with React.Fragment

      });

      it('should display dynamic text', () => {

        const props = {
          i18nKey: 'my-strong-dynamic-text',
          options: {
            firstName: 'Bob'
          }
        };

        const wrapper = mount(<Translate {...props} />);
        expect(wrapper.find(Element)).to.have.lengthOf(2);
        // expect(wrapper.text()).to.equal('Hi <strong>Bob</strong>');
        // TODO expect failing due to bug in enzyme with React.Fragment

      });

    });

    describe('links', () => {

      beforeEach(() => {
        setupI18n({
          'my-link': 'Click <a href="http://hello-world.com">here</a>.',
          'my-dynamic-link': 'Click: <a href="http://hello-world.com">Hi {name}</a>.'
        });
      });

      it('should display link', () => {

        const props = {
          i18nKey: 'my-link'
        };

        const wrapper = mount(<Translate {...props} />);

        // three children <text> + <link> + <text>
        expect(wrapper.find(Element)).to.have.lengthOf(3);

        expect(wrapper.find('a')).to.have.lengthOf(1);
        expect(wrapper.find('a').prop('href')).to.equal('#');

      });

      it('should call onLinkClick if tag is a link and the link is clicked', () => {

        const handleLinkClick = stub();
        const props = {
          i18nKey: 'my-link',
          onLinkClick: handleLinkClick
        };

        const wrapper = mount(<Translate {...props} />);

        const fakeEvent = {
            stopPropagation: stub()
        };
        wrapper.find('a').simulate('click', fakeEvent);

        expect(handleLinkClick).to.have.been.calledOnce;
        expect(handleLinkClick).to.have.been.calledWith('http://hello-world.com');

      });

      it('should display text', () => {

        const props = {
          i18nKey: 'my-dynamic-link',
          options: {
            name: 'Bob'
          }
        };

        const wrapper = mount(<Translate {...props} />);

        const element = wrapper.find(Element);
        expect(wrapper.find('a')).to.have.lengthOf(1);
        expect(wrapper.find('a').text()).to.equal('Hi Bob');

      });

    });

    describe('void', () => {

      beforeEach(() => {
        setupI18n({
          'my-text-1': 'Line 1<br/>Line 2',
          'my-text-2': 'Line 1<br></br>Line 2',
          'my-invalid-text': 'Line 1<br>invalid text</br>Line 2'
        });
      });

      it('should display break', () => {

        const props = {
          i18nKey: 'my-text-1'
        };

        const wrapper = mount(<Translate {...props} />);

        // three children <text> + <br> + <text>
        expect(wrapper.find(Element)).to.have.lengthOf(3);

        expect(wrapper.find('br')).to.have.lengthOf(1);
        expect(wrapper.find('br').children()).to.be.empty;

      });

      it('should set break tag even if it\'s not written as a void tag', () => {

        const props = {
          i18nKey: 'my-text-2'
        };

        const wrapper = mount(<Translate {...props} />);

        // three children <text> + <br> + <text>
        expect(wrapper.find(Element)).to.have.lengthOf(3);

        expect(wrapper.find('br')).to.have.lengthOf(1);
        expect(wrapper.find('br').children()).to.be.empty;

      });

      it('should not set children for a void tag', () => {

        const props = {
          i18nKey: 'my-invalid-text'
        };

        const wrapper = mount(<Translate {...props} />);

        // three children <text> + <br> + <text>
        expect(wrapper.find(Element)).to.have.lengthOf(3);

        expect(wrapper.find('br')).to.have.lengthOf(1);
        expect(wrapper.find('br').children()).to.be.empty;

      });

    });

    describe('illegal', () => {

      beforeEach(() => {
        setupI18n({
          'my-illegal-script': 'something here <script>someIllegalJavascript();</script>something there',
          'my-illegal-attributes': '<div onclick="testJsMethod();" data-test-id="test-id">test</div>'
        });
      });

      it('should ignore script tags but display the tag children as text', () => {

        const props = {
          i18nKey: 'my-illegal-script'
        };

        const wrapper = mount(<Translate {...props} />);

        // three children <text> + <text inside script> + <text>
        expect(wrapper.find(Element)).to.have.lengthOf(3);

        // script tag is ignored but text is added as a child (asseted above)
        expect(wrapper.find('script')).to.have.lengthOf(0);

      });

      it('should ignore "on" events added as attributes', () => {

        const props = {
          i18nKey: 'my-illegal-attributes'
        };

        const wrapper = mount(<Translate {...props} />);

        expect(wrapper.find(Element)).to.have.lengthOf(1);

        expect(wrapper.find('div')).to.have.lengthOf(1);
        // should only have valid attribute as prop
        expect(wrapper.find('div').props()).to.deep.equal({
          'data-test-id': 'test-id',
          'children': 'test'
        });

      });

    });

    function setupI18n(languageDefinition = {}) {
      SimpleI18n.init({
        languages: {
          'common': {
            ...(languageDefinition)
          }
        }
      });
    }

});
