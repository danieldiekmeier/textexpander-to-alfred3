# TextExpander to Alfred 3

**⚠️ Heads up ⚠️**: I programmed this in April 2016. I then converted all my snippets, so I haven't needed this tool since. In the last years, both TextExpander and Alfred have released several new major versions, which may or may not work with this tool (Judging by the support requests I get, they don't!)

If this tool does not work, I can't help you. If you know Node.js, you may be able to fix it yourself and send a Pull Request to my respository. I will probably accept it!

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
