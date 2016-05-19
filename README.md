# TextExpander to Alfred 3

With [TextExpander](https://smilesoftware.com/textexpander) changing its business model, the new [Alfred](https://www.alfredapp.com/) version supporting text replacement, and the general wish to use the smallest number of different apps, I wrote this script to convert the `.textexpander` files to `.alfredsnippets` files.

TextExpander uses a `plist` with all the entries in an array, and Alfred uses a ZIP file containing a JSON file for each snippet.

## Installation

I recommend you to do

```sh
npm install -g textexpander-to-alfred3
```

But you can, of course, do whatever you want.

## Usage

First, you'll have to export your TextExpander snippets. To do that, just right click on a snippet folder and select `Save a Copy of Group`.

Then, you just have to run the program with the `.textexpander` file as the only argument. It will then put a `.alfredsnippets` file in your current working directory. Open that file with Alfred to load the snippets.

For example:

```sh
textexpander-to-alfred3 Signatures.textexpander
> Wrote file /Users/You/Signatures.alfredsnippets
```

You can also use `te2a3` instead with the same result:

```sh
te2a3 Signatures.textexpander
> Wrote file /Users/You/Signatures.alfredsnippets
```
