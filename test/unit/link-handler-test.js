import { expect, use as chaiUse } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { LinkHanlder } from '../../src/link-handler';

chaiUse(sinonChai);

describe('LinkHanlder', () => {

    describe('initialising', () => {

      it('should not throw error when initialising', () => {
          expect(() => new LinkHanlder()).to.not.throw();
      });

    });

    describe('handle', () => {

      it('should call handler when handle is called', () => {
          const linkHandler = new LinkHanlder();
          const myHandler = spy();
          linkHandler.setHandler(myHandler);
          linkHandler.handle("some-link");
          expect(myHandler).to.have.been.calledOnce;
          expect(myHandler).to.have.been.calledWith("some-link");
      });

      it('should not throw error when calling "handle" before setting handler', () => {
          const linkHandler = new LinkHanlder();
          expect(() => linkHandler.handle("some-link")).to.not.throw();
      });

      it('should not throw error when calling "handle" for a null handler', () => {
          const linkHandler = new LinkHanlder();
          linkHandler.setHandler(null);
          expect(() => linkHandler.handle("some-link")).to.not.throw();
      });

      it('should be able to reset handler', () => {
          const linkHandler = new LinkHanlder();
          const myHandler = spy();

          linkHandler.setHandler(myHandler);
          linkHandler.handle("some-link");
          expect(myHandler).to.have.been.calledOnce;

          // now reset spy
          myHandler.resetHistory();

          // reset handler and call 'handle()'
          linkHandler.reset();
          linkHandler.handle("another-link");
          expect(myHandler).to.have.been.not.called;

      });

    });

});
