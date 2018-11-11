import { expect, use as chaiUse } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { hasTags, isTag, isVoidTag, isLinkTag, isIllegalTag, extractAttributes, splitByTags } from '../../src/helpers';

chaiUse(sinonChai);

describe('LinkHanlder', () => {

    describe('hasTags', () => {

      assertInputOutput([
        {
          input: 'Hello world',
          output: false
        },
        {
          input: 'Hello <br/> world',
          output: true
        },
        {
          input: 'Hello <br> <br/> world',
          output: true
        },
        {
          input: 'Hello <strong></strong> world',
          output: true
        },
        {
          input: '<strong></strong>',
          output: true
        },
        {
          input: '<script>some test</script>',
          output: true
        },
        {
          input: '<div>{variable}</script>',
          output: true
        },
        {
          input: '<DIV>some text</DIV>',
          output: true
        },
        {
          input: '<div attr="test">some test</div>',
          output: true
        }
      ]);

      function assertInputOutput(tests) {
        tests.forEach(({ input, output }) => {
          it(`should return '${output}' when input is \'${input}\'`, () => {
              expect(hasTags(input)).to.equal(output);
          });
        });
      }

    });

    describe('isTag', () => {

      assertInputOutput([
        {
          input: 'Hello world',
          output: false
        },
        {
          input: 'Hello <br/> world',
          output: false
        },
        {
          input: '<br></br>',
          output: true
        },
        {
          input: '<br/>',
          output: true
        },
        {
          input: '<br />',
          output: true
        },
        {
          input: '<script>some test</script>',
          output: true
        },
        {
          input: '<div>{variable}</script>',
          output: true
        },
        {
          input: '<DIV>text</DIV>',
          output: true
        },
        {
          input: '<div attr="test">some test</div>',
          output: true
        }
      ]);

      function assertInputOutput(tests) {
        tests.forEach(({ input, output }) => {
          it(`should return '${output}' when input is \'${input}\'`, () => {
              expect(isTag(input)).to.equal(output);
          });
        });
      }

    });

    describe('isVoidTag', () => {

      assertInputOutput([
        {
          input: 'br',
          output: true
        },
        {
          input: 'BR',
          output: true
        },
        {
          input: 'div',
          output: false
        },
        {
          input: 'a',
          output: false
        },
        {
          input: 'hello world',
          output: false
        },
        {
          input: 'script',
          output: false
        }
      ]);

      function assertInputOutput(tests) {
        tests.forEach(({ input, output }) => {
          it(`should return '${output}' when input is \'${input}\'`, () => {
              expect(isVoidTag(input)).to.equal(output);
          });
        });
      }

    });

    describe('isLinkTag', () => {

      assertInputOutput([
        {
          input: 'a',
          output: true
        },
        {
          input: 'A',
          output: true
        },
        {
          input: 'div',
          output: false
        },
        {
          input: 'strong',
          output: false
        },
        {
          input: 'span',
          output: false
        },
        {
          input: 'script',
          output: false
        }
      ]);

      function assertInputOutput(tests) {
        tests.forEach(({ input, output }) => {
          it(`should return '${output}' when input is \'${input}\'`, () => {
              expect(isLinkTag(input)).to.equal(output);
          });
        });
      }

    });

    describe('isIllegalTag', () => {

      assertInputOutput([
        {
          input: 'script',
          output: true
        },
        {
          input: 'SCRIPT',
          output: true
        },
        {
          input: 'scRIpT',
          output: true
        },
        {
          input: 'iframe',
          output: true
        },
        {
          input: 'IFRAME',
          output: true
        },
        {
          input: 'img',
          output: true
        },
        {
          input: 'IMG',
          output: true
        },
        {
          input: 'div',
          output: false
        },
        {
          input: 'strong',
          output: false
        },
        {
          input: 'span',
          output: false
        }
      ]);

      function assertInputOutput(tests) {
        tests.forEach(({ input, output }) => {
          it(`should return '${output}' when input is \'${input}\'`, () => {
              expect(isIllegalTag(input)).to.equal(output);
          });
        });
      }

    });

    describe('extractAttributes', () => {

      it('should extract attribute', () => {

        const str = 'id="test"';
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test'
        });

      });

      it('should extract multiple attributes', () => {

        const str = 'id="test" className="my-class"';
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test',
          className: 'my-class'
        });

      });

      it('should extract valid attributes', () => {

        const str = 'id="test" data-test-id="my-test-id"';
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test',
          'data-test-id': 'my-test-id'
        });

      });

      it('should ignore whitespace around attributes', () => {

        const str = ' id="test"    className="my-class" ';
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test',
          className: 'my-class'
        });

      });

      it('should not ignore whitespace between attribute key and value', () => {

        const str = 'id="test" className ="my-class" data-test-id= "some-id"';
        // should ignore 'className' and 'data-test-id'
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test'
        });

      });

      it('should ignore illegal attributes', () => {

        const str = 'id="test" onclick="myHalder();" href="some-link"';
        // ignore 'on' event attributes
        expect(extractAttributes(str)).to.deep.equal({
          id: 'test',
          href: 'some-link'
        });

      });

      it('should return empty attributes', () => {

        const str = '   ';
        expect(extractAttributes(str)).to.deep.equal({});

      });

    });

    describe('splitByTags', () => {

      // TODO add tests

    });

});
