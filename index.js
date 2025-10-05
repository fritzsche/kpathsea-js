import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

// Promisify the execFile function for async/await usage
const execFileAsync = promisify(execFile);

/**
 * An enumeration of common file formats recognized by kpsewhich.
 * Use these values with the `findFile` method.
 */
export const FILE_FORMAT = {
    // Font formats
    TFM: "tfm",
    VF: "vf",
    PK: "pk",
    TYPE1: "type1 fonts",
    TRUETYPE: "truetype fonts",
    OPENTYPE: "opentype fonts",
    
    // TeX source and style formats
    TEX: "tex",
    BIB: "bib",
    BST: "bst",
    CLS: "cls",
    STY: "sty",

    // Other configuration and mapping formats
    CNF: "cnf",
    MAP: "map",
    ENC: "enc",

    // A special value to let kpsewhich search all known formats. This is the default.
    ALL: "all" 
};

/**
 * A class to interact with the kpsewhich command-line tool.
 */
export class Kpathsea {
    /**
     * Initializes a new Kpathsea instance.
     * It verifies the path to the `kpsewhich` executable.
     * @param {string} [texPath] - Optional path to the directory containing TeX binaries (like `kpsewhich`).
     * If not provided, it assumes `kpsewhich` is in the system's PATH.
     */
    constructor(texPath) {
        this.kpsewhichPath = 'kpsewhich';
        if (texPath) {
            const kpsewhichWithExt = process.platform === 'win32' ? 'kpsewhich.exe' : 'kpsewhich';
            const potentialPath = path.join(texPath, kpsewhichWithExt);
            try {
                // Check if the file exists at the specified path.
                fs.accessSync(potentialPath, fs.constants.F_OK);
                this.kpsewhichPath = potentialPath;
            } catch (e) {
                // If it doesn't exist, warn the user and fall back to the system PATH.
                console.warn(`[kpathsea-js] Warning: 'kpsewhich' not found at ${potentialPath}. Falling back to system PATH.`);
            }
        }
    }

    /**
     * Finds a file using the `kpsewhich` command.
     * @param {string} fileName - The name of the file to find (e.g., "cmr10", "article.cls").
     * @param {string} [format=FILE_FORMAT.ALL] - The file format from the FILE_FORMAT enum.
     * @returns {Promise<string>} A promise that resolves with the full, absolute path to the file.
     * @throws {Error} Throws an error if `kpsewhich` fails or the file is not found.
     */
    async findFile(fileName, format = FILE_FORMAT.ALL) {
        if (!fileName) {
            throw new Error("fileName must be provided.");
        }

        const args = [];
        // Only add the --format flag if a specific format is requested.
        if (format !== FILE_FORMAT.ALL) {
            args.push(`--format=${format}`);
        }
        args.push(fileName);

        try {
            const { stdout } = await execFileAsync(this.kpsewhichPath, args);
            const resultPath = stdout.trim();
            
            // kpsewhich can return an empty string and a success exit code if nothing is found.
            if (!resultPath) {
                 throw new Error(`File '${fileName}' not found for format '${format}'.`);
            }
            return resultPath;
        } catch (error) {
            // kpsewhich returns a non-zero exit code if the file is not found, which execFileAsync catches.
            // We create a more informative error message.
            const stderr = error.stderr || '';
            throw new Error(`[kpathsea-js] Error finding '${fileName}': ${stderr.trim() || error.message}`);
        }
    }

    findFileSync(fileName, format = FILE_FORMAT.ALL) {
        if (!fileName) {
            throw new Error("fileName must be provided.");
        }

        const args = [];
        // Only add the --format flag if a specific format is requested.
        if (format !== FILE_FORMAT.ALL) {
            args.push(`--format=${format}`);
        }
        args.push(fileName);

        try {
            const { stdout } = execFile(this.kpsewhichPath, args);
            const resultPath = stdout.trim();
            
            // kpsewhich can return an empty string and a success exit code if nothing is found.
            if (!resultPath) {
                 throw new Error(`File '${fileName}' not found for format '${format}'.`);
            }
            return resultPath;
        } catch (error) {
            // kpsewhich returns a non-zero exit code if the file is not found, which execFileAsync catches.
            // We create a more informative error message.
            const stderr = error.stderr || '';
            throw new Error(`[kpathsea-js] Error finding '${fileName}': ${stderr.trim() || error.message}`);
        }
    }



}
