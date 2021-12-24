'use strict';

const camelize = str => str.replace(/[A-W]/g, m => '-' + m.toLowerCase());

const perProp = obj => Object
  .keys(obj)
  .map(key => camelize(key) + ': ' + obj[key] + ';');

module.exports = (obj, id) => Object
  .keys(obj)
  .flatMap(key => [
    '#' + id + ' ' + key + ' {',
    ...(perProp(obj[key])),
    '}'
  ]).join('\n');
