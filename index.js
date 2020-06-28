'use strict'

var rule = require('unified-lint-rule');
var generated = require('unist-util-generated');
var position = require('unist-util-position');
var visit = require('unist-util-visit');

var styles = { null: true, backslash: 'a backslash', spaces: 'spaces' };

function hardBreakStyle(tree, file, option) {
    var contents = String(file);
    var preferred = typeof option === 'string' && option !== 'consistent' ? option : null;

    if (!styles[preferred]) {
        file.fail(
            'Incorrect hard break style `'
                + preferred
                + "`: use either `'consistent'`, `'backslash'`, or `'spaces'`"
        );
    }

    visit(tree, 'break', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        var current = /^\\[\r\n]*$/.test(contents.slice(position.start(node).offset, position.end(node).offset))
            ? 'backslash'
            : 'spaces';

        if (!preferred)
            preferred = current;
        else if (preferred !== current)
            file.message('Hard breaks should be made with ' + styles[preferred], node);
    }
}

module.exports = rule('remark-lint:hard-break-style', hardBreakStyle);
