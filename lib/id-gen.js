'use strict';

// deterministic id generator
// ids only need to be unique within a single bxr() run;
// resetIds() at the start of each run keeps output reproducible (snapshot-testable)

let counter = 0;

const nextId = () => 'id' + (counter++);

const resetIds = () => { counter = 0; };

module.exports = {nextId, resetIds};
