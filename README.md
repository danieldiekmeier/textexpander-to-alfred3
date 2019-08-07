# TextExpander to Alfred 3

## This tool is now available as a web app: [alfred.danieldiekmeier.de](http://alfred.danieldiekmeier.de/).

You can, of course, still use the CLI tool, both will give the same result. But the web version will be much quicker, easier and better suited for people unfamiliar with Node.

## Motivation

With [TextExpander](https://smilesoftware.com/textexpander) changing its business model, the new [Alfred](https://www.alfredapp.com/) version supporting text replacement, and the general wish to use the smallest number of different apps, I wrote this script to convert the `.textexpander` files to `.alfredsnippets` files.

TextExpander uses a `plist` with all the entries in an array, and Alfred uses a ZIP file containing a JSON file for each snippet.

## Usage

First, you'll have to export your TextExpander snippets. To do that, right click on a snippet folder and select `Save a Copy of Group`.

Then, you just have to run the program with the `.textexpander` file as the only argument. It will then put a `.alfredsnippets` file in your current working directory. Open that file with Alfred to load the snippets.

You could install the tool with `npm install -g textexpander-to-alfred3`, but you can also use `npx` to skip the permanent installation::

```sh
npx textexpander-to-alfred3 Signatures.textexpander
> Wrote file /Users/You/Signatures.alfredsnippets
```

__NOTE__: For some reason, TextExpander v3 does not export a snippet group's group-level prefix, so you will have to re-do that in Alfred once you import it.
