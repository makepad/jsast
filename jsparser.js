// Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
// various contributors and released under an MIT license.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/ternjs/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/ternjs/acorn/issues
//
// This file defines the main parser interface. The library also comes
// with a [error-tolerant parser][dammit] and an
// [abstract syntax tree walker][walk], defined in other files.
//
// [dammit]: acorn_loose.js
// [walk]: util/walk.js
/*
List of Acorn contributors. Updated before every release.

Adrian Rakovsky
Alistair Braidwood
Andres Suarez
Angelo
Aparajita Fishman
Arian Stolwijk
Artem Govorov
Brandon Mills
Charles Hughes
Conrad Irwin
David Bonnet
Domenico Matteo
ForbesLindesay
Forbes Lindesay
Gilad Peleg
impinball
Ingvar Stepanyan
Jackson Ray Hamilton
Jesse McCarthy
Jiaxing Wang
Joel Kemp
Johannes Herr
Jordan Klassen
Jürg Lehni
keeyipchan
Keheliya Gallaba
Kevin Kwok
krator
Marijn Haverbeke
Martin Carlberg
Mathias Bynens
Mathieu 'p01' Henri
Matthew Bastien
Max Schaefer
Max Zerzouri
Mihai Bazon
Mike Rennie
Nicholas C. Zakas
Nick Fitzgerald
Olivier Thomann
Oskar Schöldström
Paul Harper
Peter Rust
PlNG
Prayag Verma
ReadmeCritic
r-e-d
Richard Gibson
Rich Harris
Sebastian McKenzie
Timothy Gu
Toru Nagashima
zsjforcn
*/

var Parser = require('./jsparser/jsstate').Parser

// mixin the other files onto parser
require('./jsparser/jsparseutil')
require('./jsparser/jsstatement')
require('./jsparser/jscomments')
require('./jsparser/jslval')
require('./jsparser/jsexpression')
require('./jsparser/jslocation')

exports.Parser = require('./jsparser/jsstate').Parser
exports.plugins = require('./jsparser/jsstate').plugins
exports.defaultOptions = require('./jsparser/jsoptions').defaultOptions
exports.Node = require('./jsparser/jsnode')
exports.TokenType = require('./jsparser/jstokentype').TokenType
exports.tokTypes = require('./jsparser/jstokentype').types
exports.TokContect = require('./jsparser/jstokencontext').TokContext
exports.tokContexts = require('./jsparser/jstokencontext')
exports.isIdentifierChar = require('./jsparser/jsidentifier').isIdentifierChar
exports.isIdentifierStart = require('./jsparser/jsidentifier').isIdentifierStart
exports.Token = require('./jsparser/jstokenize').Token
exports.isNewLine = require('./jsparser/jswhitespace').isNewLine
exports.lineBreak = require('./jsparser/jswhitespace').lineBreak
exports.lineBreakG = require('./jsparser/jswhitespace').lineBreakG
exports.version = "3.1.0"
// The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and
// returns an abstract syntax tree as specified by [Mozilla parser
// API][api].
//
// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

exports.parse = function parse(input, options) {
	return new Parser(options, input).parse()
}

// This function tries to parse a single expression at a given
// offset in a string. Useful for parsing mixed-language formats
// that embed JavaScript expressions.

exports.parseExpressionAt = function parseExpressionAt(input, pos, options) {
	var p = new Parser(options, input, pos)
	p.nextToken()
	return p.parseExpression()
}

// Acorn is organized as a tokenizer and a recursive-descent parser.
// The `tokenizer` export provides an interface to the tokenizer.

exports.tokenize = function tokenizer(input, options) {
	return new Parser(options, input)
}
