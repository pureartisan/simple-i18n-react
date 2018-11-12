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

        const str = 'id="test" onclick="myHalder();" onsomething="myOtherHalder();" href="some-link"';
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

      it('should not split when there are no tags', () => {

        const str = 'Hello World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello World'
        }]);

      });

      it('should split when there are tags', () => {

        const str = 'Hello <strong>awesome</strong> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'strong',
          text: 'awesome',
          attr: {}
        }, {
          text: ' World'
        }]);

      });

      it('should handle case insensitive tags', () => {

        const str = 'Hello <StrONg>awesome</strong> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'strong',
          text: 'awesome',
          attr: {}
        }, {
          text: ' World'
        }]);

      });

      it('should handle void tags', () => {

        const str = 'Hello <br/> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'br',
          text: undefined,
          attr: {}
        }, {
          text: ' World'
        }]);

      });

      it('should handle void tags specified as full tags', () => {

        const str = 'Hello <br></br> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'br',
          text: '',
          attr: {}
        }, {
          text: ' World'
        }]);

      });

      it('should handle void tags specified tags with attributes and text', () => {

        const str = 'Hello <br className="my-class">test</br> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'br',
          text: 'test',
          attr: {
            className: 'my-class'
          }
        }, {
          text: ' World'
        }]);

      });

      it('should handle attributes and text', () => {

        const str = 'Hello <span className="my-class" data-test-id="my-test-id">test</span> World';
        expect(splitByTags(str)).to.deep.equal([{
          text: 'Hello '
        },{
          tag: 'span',
          text: 'test',
          attr: {
            className: 'my-class',
            'data-test-id': 'my-test-id'
          }
        }, {
          text: ' World'
        }]);

      });

      it('should handle tags only', () => {

        const str = '<strong>test</strong>';
        expect(splitByTags(str)).to.deep.equal([{
          tag: 'strong',
          text: 'test',
          attr: {}
        }]);

      });

      it('should handle dynamic variables', () => {

        const str = '<strong>{firstName}</strong>';
        expect(splitByTags(str)).to.deep.equal([{
          tag: 'strong',
          text: '{firstName}',
          attr: {}
        }]);

      });

      it('should handle empty string', () => {

        const str = '';
        expect(splitByTags(str)).to.deep.equal([]);

      });

    });

});
