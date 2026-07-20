'use strict';

const isPlainObject = (val) =>
  val && (typeof val === 'object') && !Array.isArray(val);

module.exports = {isPlainObject};
