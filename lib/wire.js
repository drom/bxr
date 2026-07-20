'use strict';

// wire macro definition

const {nextId} = require('./id-gen.js');

const wire = {
  enter: (opto, args) => {
    const wireColor = opto.color || '#000000';
    const gateColor = opto.gateColor || '#ffffaa';
    const labelColor = opto.labelColor || '#ffffffff';

    // add wire output pin
    opto.output = nextId();
    const output = ['box', {w: 8, h: 8, output: opto.output}];

    // add wire label
    const label = opto.label
      ? [['middle', {fill: labelColor, stroke: wireColor, rx: 8}, opto.label]]
      : [];

    // add small wire between label and body
    const link = (opto.kind && opto.label)
      ? [['line', {h: 2, w: 8, x1: 0, y1: 1, x2: 8, y2: 1, stroke: wireColor, 'stroke-width': 1}]]
      : [];

    // add desired body drawing
    // TODO add all gate drawings
    const body = opto.kind
      ? [['middle', {
        stroke: wireColor,
        fill: gateColor,
        opacity: 1,
        minH: args.length * 16
      }, opto.kind]]
      : [];

    // add routing channel
    // TODO add routing wires
    const router = args.length ? [['box', {
      w: args.length * 8,
      h: args.length * 8,
      fill: '#555'
    }]] : [];

    // add pins
    const pins = args.length ? [['right',
      ...args.map((e, i) => {
        const obj = {w: 8, h: 8, input: '???'};
        args[i][1].ipObj = obj;
        return ['box', obj];
      })
    ]] : [];

    // add sources
    const sources = args.length ? [['right', ...args]] : [];

    return ['middle', {reverse: true},
      output,
      ...label,
      ...link,
      ...body,
      ...pins,
      ...router,
      ...sources
    ];
  },
  leave: (opto, args) => {
    args.map(e => {
      const obj = e[1];
      obj.ipObj.input = obj.output;
    });
  }
};

module.exports = {wire};
