#!/usr/bin/env node
import fs from 'fs';


/**
 * This program uses the Template Method pattern which allows it to be extensible and maintainable.
 * 
 * 
 * ProcessLogs(class) <---inherits------------ ProcessCSVLogs
 *                                  |--------- ProcessJSONLogs (We can implement this if we need to extend our program to handle JSON files)
 *                                  |--------- ...otherFileTypes...
 * 
 * Developer only need to override one method, the parseFileContent() method. 
 * 
 * The Application logic will use the file extension to delagate the processing to the correct handler. 
 */

class App {
  
  PARAMETERS = {
    "-f": "fileName",
    "-d": "timeStamp"
  }

  main() {
    const args = this.#getArgs();
    const parsedArgs = this.#parseArguments(args);

    if (!parsedArgs.fileName) {
      console.error("Error: Missing required parameter -f (filename)");
      console.error("Usage: node script.js -f <filename> -d <date>");
      process.exit(1);
    }
    
    if (!parsedArgs.timeStamp) {
      console.error("Error: Missing required parameter -d (date)");
      console.error("Usage: node script.js -f <filename> -d <date>");
      process.exit(1);
    }

    const content = this.#retrieveFileContent(parsedArgs);
    const fileExtension = this.#getFileExtension(parsedArgs)
    
    switch (fileExtension) {
      case "csv":
        new ProcessCsvLogs(parsedArgs).findMostUsedCookie(content)
        break;
      default:
        new ProcessLogs(parsedArgs).findMostUsedCookie(content)
    }
  }

  #getArgs() {
    return process.argv.slice(2);
  }

  /**
   * 
   * @param {Array.<string>} args 
   * @returns {Object.<string, string>} Parces arguments into an object where the key is the parameter name and value is the argument. 
   */
  #parseArguments(args) {
    const chunkedArgs = Utilities.chunk(args, 2)
    const argMap = {};

    for (const [key, value] of chunkedArgs) {
      if (!this.PARAMETERS[key]) {
        continue;
      }
      argMap[this.PARAMETERS[key]] = value
    }

    return argMap;
  }

  /**
   * 
   * @param {Object.<string, string>} argMap 
   * @returns {*} File's content
   */
  #retrieveFileContent(argMap) {
    try {
      return fs.readFileSync(argMap.fileName, 'utf-8');
    } catch(e) {
      console.error(`Error: Cannot read file '${argMap.fileName}'`);
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * 
   * @param {Object.<string, string>} argMap 
   * @returns 
   */
  #getFileExtension(argMap) {
    return argMap.fileName.split('.').pop().toLowerCase();
  }
}

class ProcessLogs {
  args;

  constructor(args) {
    this.args = args;
  }

  /**
   * 
   * @param {*} content 
   * @description This is the Template method
   */
  findMostUsedCookie(content) {
    const parsedLogs = this.parseFileContent(content);
    const analyzedLogs = this.#analyzeLogs(parsedLogs, this.args.timeStamp)

    if (analyzedLogs) {
      analyzedLogs.forEach(cookie => console.log(cookie));
    }
  }

  /**
   * @override This method must be overriden to implement parsing logic for different types of data structures
   * @param {any} content The file's content, the data structure will vary depending on the file type
   * @returns {Object.<string, string[]>} A map where keys are dates and values are arrays of cookies
   */
  parseFileContent(logs) {
    return {};
  }

  /**
   * 
   * @param {Object.<string, string[]>} logMap A map where keys are dates and values are arrays of cookies
   * @param {string} date Must be formated as YYYY-MM-DD
   * @returns {Array.<string>} Array of most used cookies
   */
  #analyzeLogs(logMap, date) {
    const freqMap = {}
    const logs = logMap[date];

    if (!logs || logs.length === 0) {
      console.log("There are no cookies for this date. Please make sure the date is formatted YYYY-MM-DD");
      return null;
    }

    for (const cookie of logs) {
      freqMap[cookie] = (freqMap[cookie] ?? 0) + 1;
    }

    const maxFreq = Math.max(...Object.values(freqMap));

    const mostUsed = Object.keys(freqMap).filter(
      cookie => freqMap[cookie] === maxFreq
    );

    return mostUsed
  }
}


class ProcessCsvLogs extends ProcessLogs {
  parseFileContent(content) {
    const logMap = {}
    const lines = content.trim().split('\n');

    for (let i = 1; i < lines.length; i++) {
      const [cookie, timestamp] = lines[i].split(',');
      
      if (!cookie || !timestamp) {
        continue;
      }

      const date = timestamp.split('T')[0];

      if (!logMap[date]) {
        logMap[date] = [];
      }

      logMap[date].push(cookie)
    }
    return logMap;
  }
}

class Utilities {

  /**
   * 
   * @param {any[]} array Array to break down into chuncks
   * @param {number} size Size of each chunk
   * @returns {any[][]} 
   * @description Breaks down an array into chuncks of size n
   */
  static chunk(array, size) {
    const chunks = [];

    if (!Array.isArray(array) || isNaN(Number(size))) {
      return chunks;
    }

    for (let i = 0; i < array.length; i += 1) {
      const index = Math.floor(i/size);

      if (!chunks[index]) {
        chunks[index] = []
      }

      chunks[index].push(array[i]);
    }

    return chunks
  }
}

// ****************************** Run App ****************************
const app = new App();
app.main();