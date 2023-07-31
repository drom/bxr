'use strict';

const onml = require('onml');
const bxr = require('../lib');
const openSans = require('../lib/open-sans.js');

const texter = bxr.texterer(openSans()(14));
const {top, bottom, left, right, center, box} = bxr.bxr({padding: 4, texter});

const body0 = top(
  bottom(box(20, 40), box(20, 20), 'Bob who?', box(20, 30)),
  center(box(20, 20), 'Hello', box(40, 40), 'Alice Copper', box(20, 20), box(20, 20), box(20, 20)),
  right(box(32, 32), 'John', box(8, 64), 'Lennon', box(64, 8)),
  left('Paul', 'McCartney', box(40, 200))
);

const testo = {
  t1: {
    body: body0,
    style: {
      rect: {
        fill: 'rgba(255, 255, 255, 0.1)'
      },
      text: {
        fill: 'rgb(181, 255, 131)',
        fontFamily: '"Open Sans"',
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        fontSize: '14px'
      }
    }
  },
  t2: {
    body: body0,
    style: {
      rect: {
        strokeWidth: '1px',
        stroke: '#fff',
        fill: 'none'
      },
      text: {
        fill: '#fff',
        fontFamily: '"Open Sans"',
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        fontSize: '14px'
      }
    }
  },
  t3: {
    body: body0,
    style: {
      rect: {
        strokeWidth: '1px',
        stroke: '#000',
        fill: 'none'
      },
      text: {
        fill: '#000',
        fontFamily: '"Open Sans"',
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        fontSize: '14px'
      }
    }
  },
  t4: {
    body: center(
      top('foo'),
      top('bar'),
      top('buZzzzzzzz')
    ),
    style: {
      rect: {
        strokeWidth: '1px',
        stroke: '#fff',
        fill: 'none'
      },
      text: {
        fill: '#fff',
        fontFamily: '"Open Sans"',
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        fontSize: '14px'
      }
    }
  },
};

global.DEMO = async div => {
  div = (typeof div === 'string') ? document.getElementById(div) : div;
  for (const key of Object.keys(testo)) {
    const valo = testo[key];
    const style = valo.style || {};
    const body = valo.body;
    const ml = onml.gen.svg(body[1].w + 1, body[1].h + 1).concat([
      ['style', bxr.obj2css(style, key)],
      ['g', onml.tt(.5, .5), body]
    ]);
    const html = onml.stringify(ml);
    const span = document.createElement('span');
    span.id = key;
    span.innerHTML = html;
    div.append(span);
  }
};

/* eslint-env browser */
