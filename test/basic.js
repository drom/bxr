'use strict';

const chai = require('chai');

const lib = require('../lib/index.js');
const {bxr} = lib;
const {ttResolve} = require('../lib/tt-resolve.js');
const {router} = require('../lib/router.js');
const {expandMacros} = require('../lib/expand-macros.js');
const {resetIds} = require('../lib/id-gen.js');

const expect = chai.expect;

// pull the numeric width/height off the generated <svg>
const svgSize = (svg) => {
  const m = svg.match(/<svg[^>]*\bwidth="(\d+)"[^>]*\bheight="(\d+)"/);
  return {w: parseInt(m[1], 10), h: parseInt(m[2], 10)};
};

describe('exports', () => {
  it('bxr is a function', () => {
    expect(lib.bxr).to.be.a('function');
  });
  it('wd is a function', () => {
    expect(lib.wd).to.be.a('function');
  });
  it('texterer / openSans / obj2css exported', () => {
    expect(lib.texterer).to.be.a('function');
    expect(lib.openSans).to.be.a('function');
    expect(lib.obj2css).to.be.a('function');
  });
});

describe('bxr()', () => {
  it('returns an svg string', () => {
    const svg = bxr({bxr: ['box', {w: 20, h: 20}], config: {}});
    expect(svg).to.be.a('string');
    expect(svg).to.match(/^<svg[\s\S]*<\/svg>$/);
  });

  it('accepts a bare array (shorthand)', () => {
    const a = bxr(['box', {w: 20, h: 20}]);
    const b = bxr({bxr: ['box', {w: 20, h: 20}], config: {}});
    expect(a).to.equal(b);
  });

  it('is deterministic across runs (macros included)', () => {
    const make = () => ({bxr: ['left',
      ['wire', {kind: '&', label: 'r'},
        ['wire', {label: 'a'}],
        ['wire', {label: 'b'}]
      ]
    ], config: {}});
    expect(bxr(make())).to.equal(bxr(make()));
  });

  it('sizes the outer box to fit a single box plus padding', () => {
    const {w, h} = svgSize(bxr({bxr: ['box', {w: 20, h: 20}], config: {padding: 4}}));
    // box element itself carries no padding; outer svg = box + 1 (half-pixel *2)
    expect(w).to.equal(21);
    expect(h).to.equal(21);
  });

  it('left stacks children vertically', () => {
    const one = svgSize(bxr({bxr: ['left', ['box', {w: 20, h: 20}]], config: {padding: 4}}));
    const two = svgSize(bxr({bxr: ['left',
      ['box', {w: 20, h: 20}], ['box', {w: 20, h: 20}]
    ], config: {padding: 4}}));
    // same width, taller with a second child
    expect(two.w).to.equal(one.w);
    expect(two.h).to.be.greaterThan(one.h);
  });

  it('top stacks children horizontally', () => {
    const one = svgSize(bxr({bxr: ['top', ['box', {w: 20, h: 20}]], config: {padding: 4}}));
    const two = svgSize(bxr({bxr: ['top',
      ['box', {w: 20, h: 20}], ['box', {w: 20, h: 20}]
    ], config: {padding: 4}}));
    expect(two.h).to.equal(one.h);
    expect(two.w).to.be.greaterThan(one.w);
  });

  it('renders text with a <text> element', () => {
    const svg = bxr({bxr: ['left', 'Hello'], config: {padding: 4}});
    expect(svg).to.contain('<text');
    expect(svg).to.contain('Hello');
  });

  it('rotates text via (rot<angle>) prefix', () => {
    const svg = bxr({bxr: ['left', '(rot-90)Hello'], config: {padding: 4}});
    expect(svg).to.contain('rotate(-90)');
    expect(svg).to.contain('Hello');
  });

  it('multiple draws a stack of rects', () => {
    const single = bxr({bxr: ['box', {w: 20, h: 20}], config: {}});
    const stacked = bxr({bxr: ['box', {w: 20, h: 20, multiple: [3, 10, 10]}], config: {}});
    const count = (s) => (s.match(/<rect/g) || []).length;
    expect(count(single)).to.equal(1);
    expect(count(stacked)).to.equal(3);
  });

  it('applies config fill/opacity to boxes', () => {
    const svg = bxr({bxr: ['box', {w: 20, h: 20}], config: {fill: '#000', opacity: 0.1}});
    expect(svg).to.contain('fill="#000"');
    expect(svg).to.contain('fill-opacity="0.1"');
  });

  it('supports custom macros via config.macros', () => {
    const star = {
      enter: () => ['box', {w: 42, h: 42, id: 'star'}]
    };
    const svg = bxr({bxr: ['star'], config: {macros: {star}}});
    expect(svg).to.contain('width="42"');
  });
});

describe('ttResolve', () => {
  it('propagates translate offsets down into leaves', () => {
    // a box containing a translated child; after resolve the child transform
    // is absolute (parent offset folded in) and the box transform is removed
    const tree = ['g', {w: 40, h: 40, kind: 'box', transform: 'translate(10,10)'},
      ['g', {transform: 'translate(5,5)', w: 8, h: 8}]
    ];
    ttResolve([tree], 0, 0, 0);
    expect(tree[1].transform).to.equal(undefined);
    expect(tree[2][1].transform).to.equal('translate(15,15)');
  });
});

describe('router', () => {
  it('pairs input and output pins by id', () => {
    const tree = ['g', {kind: 'box'},
      ['box', {output: 'n1'}],
      ['box', {input: 'n1'}]
    ];
    const routo = router(tree);
    expect(routo).to.have.property('n1');
    expect(routo.n1.outputs).to.have.length(1);
    expect(routo.n1.inputs).to.have.length(1);
  });
});

describe('expandMacros', () => {
  it('expands the wire macro in place and links pins', () => {
    resetIds();
    const parent = [['wire', {label: 'top'},
      ['wire', {label: 'a'}],
      ['wire', {label: 'b'}]
    ]];
    expandMacros()(parent, 0);
    // wire expands to a 'middle' container
    expect(parent[0][0]).to.equal('middle');
  });

  it('links each pin input to a real output (no dangling pins)', () => {
    resetIds();
    const parent = [['wire', {kind: '&', label: 'r'},
      ['wire', {label: 'a'}],
      ['wire', {label: 'b'}]
    ]];
    expandMacros()(parent, 0);
    const routo = router(parent[0]);
    // no placeholder ids leak through
    expect(JSON.stringify(parent)).to.not.contain('???');
    // every input id must be produced by some output id
    for (const [id, o] of Object.entries(routo)) {
      if (o.inputs.length) {
        expect(o.outputs, `input ${id} has no matching output`).to.have.length.above(0);
      }
    }
  });
});

/* eslint-env mocha */
