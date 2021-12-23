'use strict';

const perProp = obj =>
  Object
    .keys(obj)
    .map(key => key + ': ' + obj[key] + ';');

module.exports = (obj, id) =>
  Object
    .keys(obj)
    .flatMap(key => [
      '#' + id + ' ' + key + ' {',
      ...(perProp(obj[key])),
      '}'
    ]).join('\n');
