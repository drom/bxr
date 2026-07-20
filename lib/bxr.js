'use strict';

const onml = require('onml');
const openSans = require('./open-sans.js');
const {texterer} = require('./texterer.js');
const {box} = require('./box.js');
const {groupper} = require('./groupper.js');
const {isPlainObject} = require('./is-plain-object.js');
const {expandMacros} = require('./expand-macros.js');
const {ttResolve} = require('./tt-resolve.js');
const {router} = require('./router.js');
const {resetIds} = require('./id-gen.js');

const reComponents = (components, config, texter) => {
  // primal box
  components.box = (args, opto) => {
    const {w, h} = opto;
    return box(config)(w, h, args, opto);
  };

  // primitive packing boxes
  'left center right top middle bottom'.split(' ').map(dir => {
    components[dir] = groupper(dir, config, texter);
  });
};

// accept either bxr(tree) or bxr({bxr: tree, config})
const normalize = (obj) => {
  if (Array.isArray(obj)) {
    return {bxr: obj, config: {}};
  }
  return obj || {};
};

const bxr = (input) => {
  const obj = normalize(input);
  const config = obj.config || {};
  config.padding = config.padding || 0;

  resetIds();

  const components = {};
  const rec = (node) => {
    if (Array.isArray(node)) {
      const tag = node[0];
      if (typeof tag !== 'string') {
        console.error('Unknown tag:', tag); // eslint-disable-line no-console
        throw new Error(`Unknown tag: ${tag}`);
      }
      const component = components[tag];
      if (component) {
        if (isPlainObject(node[1])) {
          return component([...node.slice(2)], node[1]);
        }
        return component([...node.slice(1)], {});
      }
      return node;
    }
    return node.toString();
  };
  const texter = texterer(openSans()(config.fontSize || 16), rec);
  reComponents(components, config, texter);
  // recursive macro expansion (wrap so a root-level macro can be replaced)
  const wrap = [obj.bxr];
  expandMacros(config.macros)(wrap, 0);
  const body = rec(wrap[0]);
  ttResolve([body], 0, 0, 0);
  router(body);
  const ml = [...onml.gen.svg(body[1].w + 1, body[1].h + 1),
    ['g', onml.tt(.5, .5), body]
  ];
  return onml.stringify(ml);
};

const wd = (input) => {
  const el = document.createElement('div'); // eslint-disable-line no-undef
  el.innerHTML = bxr(input);
  return el;
};

module.exports = {bxr, wd};
