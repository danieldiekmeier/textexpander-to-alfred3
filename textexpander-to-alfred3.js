#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const sanitize = require('sanitize-filename')
const plist = require('plist')
const program = require('commander')

program
  .version('0.1.2')
  .usage('<file>')
  .option('<file>', '.textexpander source file')
  .parse(process.argv)

// show help by default
if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  main()
}

function transformSnippet (snippet) {
  const name = !snippet.label || snippet.label === '' ? snippet.abbreviation.slice(0, 10) : snippet.label

  // First, look for the plain-text snippet.
  let snippetText = snippet.plainText || false;

  // If no plain-text version exists, attempt to rescue snippet text from TextExpander's serialized JSON.
  snippetText = JSON.parse(snippet.extraInfo.jsonStr).nodes[0].tx || snippetText;

  // Replace TextExpander tokens with Alfred tokens.
  snippetText = snippetText.replace(/%clipboard/g, '{clipboard}').replace(/%\|/g, '{cursor}')
  
  return {
    filename: sanitize(name) + ' [' + snippet.uuidString + '].json',
    usable: Boolean(snippetText),
    content: JSON.stringify({
      alfredsnippet: {
        snippet: snippetText
        name: name,
        uid: snippet.uuidString,
        keyword: snippet.abbreviation
      }
    }, null, 2)
  }
}

function main () {
  let plistPath = program.args[0]
  if (!path.isAbsolute(plistPath)) {
    plistPath = path.join(process.cwd(), program.args[0])
  }

  fs.readFile(plistPath, 'utf-8', function (err, plistString) {
    if (err) { throw err }

    const basename = path.basename(program.args[0], '.textexpander')
    const outFile = path.join(process.cwd(), (basename + '.alfredsnippets'))

    const output = fs.createWriteStream(outFile)
    const archive = textexpander2Alfred(plistString)

    archive.pipe(output)

    output.on('close', function () {
      console.log(`Wrote file ${outFile}`)
    })
  })
}

function textexpander2Alfred (plistString) {
  const parsedPlist = plist.parse(plistString)

  const archive = archiver('zip')

  // Use the TextExpander 3 snippet collection, if available.
  // The `snippetsTE2` key is included in the v3 snippet plist file
  // with a warning message in case someone using TextExpander v2 tries
  // to import a v3 snippet file.
  const snippets = parsedPlist.snippetsTE3 || parsedPlist.snippetsTE2

  snippets
    .map(transformSnippet)
    .filter((snippet) => {
      return snippet.usable
    })
    .forEach(function (snippet) {
      archive.append(snippet.content, {
        name: snippet.filename
      })
    })

  archive.finalize()

  return archive
}

module.exports = textexpander2Alfred
