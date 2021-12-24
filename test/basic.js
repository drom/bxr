'use strict';

const chai = require('chai');

const lib = require('../lib/index.js');

const openSans = require('../lib/open-sans.js');

const expect = chai.expect;

describe('basic', () => {
  it('bxr is function', () => {
    expect(lib.bxr).to.be.a('function');
  });
  it('can box', () => {
    const texter = lib.texterer(openSans);
    const {top, bottom, left, right, center, box} = lib.bxr({padding: 4, texter});
    const res = top(
      bottom(box(20, 40), box(20, 20), 'Bob who?', box(20, 30)),
      center(box(20, 20), 'Hello', box(40, 40), 'Alice Copper', box(20, 20), box(20, 20), box(20, 20)),
      right(box(32, 32), 'John', box(8, 64), 'Lennon', box(64, 8)),
      left('Paul', 'McCartney', box(40, 200))
    );
    // console.log(JSON.stringify(res, null, 2));
    expect(res).to.be.deep.eq(['g', {w: 431, h: 264},
      ['rect', {width: 431, height: 264}],
      ['g', {transform: 'translate(4,4)'},
        ['g', {w: 154, h: 48},
          ['rect', {width: 154, height: 48}],
          ['g', {transform: 'translate(4,4)'},
            ['g', {w: 20, h: 40},
              ['rect', {width: 20, height: 40}]
            ]
          ],
          ['g', {transform: 'translate(28,24)'},
            ['g', {w: 20, h: 20},
              ['rect', {width: 20, height: 20}]
            ]
          ],
          ['g', {transform: 'translate(52,24)'},
            ['g', {w: 74, h: 20},
              ['text', {x: 37, y: 16}, 'Bob who?']
            ]
          ],
          ['g', {transform: 'translate(130,14)'},
            ['g', {w: 20, h: 30},
              ['rect', {width: 20, height: 30}]
            ]
          ]
        ]
      ],
      ['g', {transform: 'translate(162,4)'},
        ['g', {w: 102, h: 192},
          ['rect', {width: 102, height: 192}],
          ['g', {transform: 'translate(41,4)'},
            ['g', {w: 20, h: 20},
              ['rect', {width: 20, height: 20}]
            ]
          ],
          ['g', {transform: 'translate(32.5,28)'},
            ['g', {w: 37, h: 20},
              ['text', {x: 18, y: 16}, 'Hello']
            ]
          ],
          ['g', {transform: 'translate(31,52)'},
            ['g', {w: 40, h: 40},
              ['rect', {width: 40, height: 40}]
            ]
          ],
          ['g', {transform: 'translate(4,96)'},
            ['g', {w: 94, h: 20},
              ['text', {x: 47, y: 16}, 'Alice Copper']
            ]
          ],
          ['g', {transform: 'translate(41,120)'},
            ['g', {w: 20, h: 20},
              ['rect', {width: 20, height: 20}]
            ]
          ],
          ['g', {transform: 'translate(41,144)'},
            ['g', {w: 20, h: 20},
              ['rect', {width: 20, height: 20}]
            ]
          ],
          ['g', {transform: 'translate(41,168)'},
            ['g', {w: 20, h: 20},
              ['rect', {width: 20, height: 20}
              ]
            ]
          ]
        ]
      ],
      ['g', {transform: 'translate(268,4)'},
        ['g', {w: 72, h: 168},
          ['rect', {width: 72, height: 168}],
          ['g', {transform: 'translate(36,4)'},
            ['g', {w: 32, h: 32},
              ['rect', {width: 32, height: 32}]
            ]
          ],
          ['g', {transform: 'translate(35,40)'},
            ['g', {w: 33, h: 20},
              ['text', {x: 16, y: 16}, 'John']
            ]
          ],
          ['g', {transform: 'translate(60,64)'},
            ['g', {w: 8, h: 64},
              ['rect', {width: 8, height: 64}]
            ]
          ],
          ['g', {transform: 'translate(16,132)'},
            ['g', {w: 52, h: 20},
              ['text', {x: 26, y: 16}, 'Lennon']
            ]
          ],
          ['g', {transform: 'translate(4,156)'},
            ['g', {w: 64, h: 8},
              ['rect', {width: 64, height: 8}]
            ]
          ]
        ]
      ],
      ['g', {transform: 'translate(344,4)'},
        ['g', {w: 83, h: 256},
          ['rect', {width: 83, height: 256}],
          ['g', {transform: 'translate(4,4)'},
            ['g', {w: 31, h: 20},
              ['text', {x: 15, y: 16}, 'Paul']
            ]
          ],
          ['g', {transform: 'translate(4,28)'},
            ['g', {w: 75, h: 20},
              ['text', {x: 37, y: 16}, 'McCartney']
            ]
          ],
          ['g', {transform: 'translate(4,52)'},
            ['g', {w: 40, h: 200},
              ['rect', {width: 40, height: 200}]
            ]
          ]
        ]
      ]
    ]
    );
  });
});

/* eslint-env mocha */
