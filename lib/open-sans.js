'use strict';

module.exports = function () {
  const table = [
      '6.875',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '3.21875',
      '2.65625',
      '3.203125',
      '5.15625',
      '6.6875',
      '6.203125',
      '8.75',
      '8.859375',
      '3.359375',
      '4.21875',
      '6.234375',
      '10.84375',
      '9.046875',
      '9.359375',
      '7.234375',
      '11.109375',
      '3.953125',
      '6.9375',
      '7.359375',
      '7.375',
      '3.046875',
      '4.046875',
      '11.171875',
      '7.25',
      '4.25',
      '6.609375'
    ], baseSize = 12, height = 17, descent = 5.949999999999999, defaultWidth = 9.04296875, re = new RegExp('([1])|([,])|([\\(\\)\\-\\[])|(["/\\\\fr\\{\\}])|([csz])|([\\$\\*\\+023456789<=>STXYZ\\^_egkvxy~])|([#ABCKRV])|([&D])|([%w])|([@])|([!])|([\'])|([\\.:;])|([\\?])|([Ea])|([F])|([GU])|([H])|([I])|([J])|([L])|([M])|([N])|([OQ])|([P])|([W])|([\\]])|([`])|([bdpq])|([hnu])|([il])|([j])|([m])|([o])|([t])|([\\|])');
  return function (fontSize) {
    const ratio = fontSize / baseSize;
    const getIndex = ch => {
      const m = ch.match(re);
      if (m !== null)
        for (let i = 0; i < table.length; i += 1)
          if (m[i + 1] !== undefined)
            return i;
    };
    const getWidth = str => {
      return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
    };
    return {
      getHeight: function () {
        return ratio * height;
      },
      getDescent: function () {
        return ratio * descent;
      },
      getWidth: getWidth
    };
  };
};

