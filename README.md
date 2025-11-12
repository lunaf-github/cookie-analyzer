# Most Active Cookie Finder
A command-line tool that processes cookie log files and identifies the most active cookie(s) for a specified date.

## Overview
This application analyzes cookie activity logs to determine which cookie(s) appeared most frequently on a given day. It's built with extensibility in mind using the Template Method design pattern, making it easy to support additional file formats in the future.

## Features

CSV Log Processing: Parses cookie log files in CSV format
Date-Based Analysis: Finds the most active cookie(s) for any specified date
Multiple Results: Returns all cookies that tie for the highest activity count
Extensible Architecture: Template Method pattern allows easy addition of new file format handlers (JSON, XML, etc.)

## Installation

1. Ensure you have Node.js installed on your system
2. Save the script to a file (e.g., most_active_cookie.js)
3. Make it executable (optional - for Linux):

```
bash   

chmod +x most_active_cookie.js
```

## Usage
```
bash

./most_active_cookie.js -f <filename> -d <date>
```

or 

```
cmd 

node most_active_cookie.js -f file.csv -d 2018-12-09 
```

### Parameters

- -f: (Required) Path to the cookie log file
- -d: (Required) Date to analyze in YYYY-MM-DD format

### Example
Given a log file cookie_log.csv:
```
csvcookie,timestamp
AtY0laUfhglK3lC7,2018-12-09T14:19:00+00:00
SAZuXPGUrfbcn5UA,2018-12-09T10:13:00+00:00
5UAVanZf6UtGyKVS,2018-12-09T07:25:00+00:00
AtY0laUfhglK3lC7,2018-12-09T06:19:00+00:00
SAZuXPGUrfbcn5UA,2018-12-08T22:03:00+00:00
```
Run the command:
```
bash./most_active_cookie.js -f cookie_log.csv -d 2018-12-09
```
Output:
```
AtY0laUfhglK3lC7
```
### Multiple Results
If multiple cookies have the same highest frequency, all will be returned:
```
bash./most_active_cookie.js -f cookie_log.csv -d 2018-12-08
```
Output (if both appeared once):

```
SAZuXPGUrfbcn5UA
4sMM2LxV07bPJzwf
```
### Input File Format
The application expects CSV files with the following structure:


- **Header Row**: Must contain `cookie,timestamp`
- **Cookie ID**: Alphanumeric string identifier
- **Timestamp**: ISO 8601 format with timezone (e.g., `2018-12-09T14:19:00+00:00`)

## Architecture

The application uses the **Template Method Pattern** for extensibility:
```
ProcessLogs (Abstract)
    ↓
ProcessCsvLogs (Concrete Implementation)
    ↓
Future: ProcessJsonLogs, ProcessXmlLogs, etc.
```

## Key Components

- App: Main application class handling command-line argument parsing and file reading
- ProcessLogs: Abstract base class defining the template method findMostUsedCookie()
- ProcessCsvLogs: Concrete implementation for CSV file parsing
- Utilities: Helper functions (e.g., array chunking)

## Extending the Application
To add support for a new file format:

1. Create a new class extending ProcessLogs
2. Override the parseFileContent() method
3. Add a case in the App's switch statement

```
Example:
javascriptclass ProcessJsonLogs extends ProcessLogs {
  parseFileContent(content) {
    // Implement JSON parsing logic
    // Return format: { "YYYY-MM-DD": [cookie1, cookie2, ...] }
  }
}
```
## Error Handling
The application handles various error conditions:

- Missing Parameters: Displays usage instructions
- File Not Found: Reports file reading errors
- No Data for Date: Informs user when no cookies exist for the specified date
- Malformed Data: Skips invalid log entries

## Requirements

- Node.js (with ES6 module support)
- File system read permissions for log files

## Definition
Most Active Cookie: The cookie (or cookies) that appears most frequently in the log file on a given day. Time information is used only for date extraction; all occurrences on the specified date are counted equally.