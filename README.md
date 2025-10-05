# kpathsea-js

A pure Node.js module to find files using the TeX `kpsewhich` command-line utility. This module provides a simple, promise-based API and avoids the need for native C++ bindings, making it easy to install and use across different platforms. It is designed to be a modern replacement for modules that rely on compiled extensions.

## Features

* **Pure JavaScript**: No native compilation means easy, cross-platform installation.

* **Promise-based API**: Uses modern `async/await` syntax.

* **Simple Interface**: Modeled after the popular `node-kpathsea` library.

* **Direct `kpsewhich` interaction**: Reliably resolves file paths by calling the official TeX utility.

* **File Format Support**: Includes a convenient `FILE_FORMAT` enum for specifying file types.

## Prerequisites

You must have a working TeX distribution (like TeX Live, MiKTeX, or MacTeX) installed on your system. The `kpsewhich` command must be available in your system's `PATH` for the module to work correctly.

## Installation

npm install kpathsea-js


## Usage

The module exports a `Kpathsea` class and a `FILE_FORMAT` enum.

import { Kpathsea, FILE_FORMAT } from "kpathsea-js";

// If kpsewhich is in your system's PATH:
const kpse = new Kpathsea();

// Or, if you need to specify the path to your TeX binaries directory:
// const kpse = new Kpathsea("/usr/local/texlive/2025/bin/x86_64-linux");

async function findMyFiles() {
try {
// Find a TeX Font Metric file
const tfmPath = await kpse.findFile("cmr10", FILE_FORMAT.TFM);
console.log(Found cmr10.tfm at: ${tfmPath});
// -> Found cmr10.tfm at: /usr/share/texmf-dist/fonts/tfm/public/cm/cmr10.tfm

    // Find a LaTeX class file (format is optional and will be inferred)
    const styPath = await kpse.findFile("article.cls");
    console.log(`Found article.cls at: ${styPath}`);
    // -> Found article.cls at: /usr/share/texmf-dist/tex/latex/base/article.cls

    // Example of a file not found
    await kpse.findFile("nonexistentfile.sty");

} catch (error) {
    console.error(error.message);
    // -> [kpathsea-js] Error finding 'nonexistentfile.sty': 
}
}

findMyFiles();


### API Reference

#### `new Kpathsea([texPath])`

Creates a new `Kpathsea` instance.

* `texPath` (string, optional): The absolute path to the directory containing TeX binaries (e.g., `kpsewhich`). If not provided, the module assumes `kpsewhich` is in the system's PATH.

#### `kpse.findFile(fileName, [format])`

Asynchronously finds a file.

* `fileName` (string, required): The name of the file to find (e.g., "cmr10", "article.cls").

* `format` (string, optional): The file format to search for, using a value from the `FILE_FORMAT` enum. Defaults to `FILE_FORMAT.ALL`, which lets `kpsewhich` search all known file types.

Returns a `Promise` that:

* Resolves to the absolute path of the found file (string).

* Rejects with an `Error` if the file cannot be found or if the `kpsewhich` command fails.

#### `FILE_FORMAT` Enum

An object containing common format names that can be passed to `findFile`.

| Key | `kpsewhich` format | Description | 
 | ----- | ----- | ----- | 
| `TFM` | `tfm` | TeX Font Metric | 
| `VF` | `vf` | Virtual Font | 
| `PK` | `pk` | Packed Font | 
| `TYPE1` | `type1 fonts` | PostScript Type 1 Font | 
| `TRUETYPE` | `truetype fonts` | TrueType Font | 
| `OPENTYPE` | `opentype fonts` | OpenType Font | 
| `TEX` | `tex` | TeX Source File | 
| `BIB` | `bib` | BibTeX Database | 
| `BST` | `bst` | BibTeX Style | 
| `CLS` | `cls` | LaTeX Class | 
| `STY` | `sty` | LaTeX Style Package | 
| `CNF` | `cnf` | Configuration File | 
| `MAP` | `map` | Font Map File | 
| `ENC` | `enc` | Encoding File | 
| `ALL` | (no format option) | Search all known file types. | 

## License

MIT