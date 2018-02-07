# mb2thw

[![pipeline status](https://gitlab.com/TehTotalPwnage/mb2thw/badges/master/pipeline.svg)](https://gitlab.com/TehTotalPwnage/mb2thw/commits/master)

> A parser for various Touhou Wiki article templates.

mb2thw provides various parsers and scripts in order to help abstract the various
templates available on the wiki, making them easier to utilize.

## Usage
```
~/mb2thw$ node index.js
? What type of album is this? (Use arrow keys)
❯ Official CDs
  Original CDs
  Other
  ...
```
After going through all the prompts, you will have a fully generated MusicArticle
ready for inputting.

## API
These are the command line arguments that can be used:
```
Usage: index [options]

Options:
  -V, --version                         output the version number
  -j, --json <path to json file>        Load supplementary data from a JSON file
  -m, --musicbrainz <musicbrainz uuid>  Fetch a release by MusicBrainz UUID
  -h, --help                            output usage information
```

## Installation
This project installs much like other Node.js projects:
```
~$ git clone https://github.com/TehTotalPwnage/mb2thw.git
~$ cd mb2thw
~/mb2thw$ npm install
```
