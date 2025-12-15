// Function to convert sheet data to JSON format
function json(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (sheet === null) {
    return 'Sheet not found';
  }

  const data = sheet.getDataRange().getValues();
  const jsonData = convertToJson(data);
  
  return jsonData;
}

// Function to convert a 2D array to JSON
function convertToJson(data) {
  const headers = data[0];
  const raw_data = data.slice(1);
  let json = [];
  
  raw_data.forEach(d => {
    let object = {};
    for (let i = 0; i < headers.length; i++) {
      object[headers[i]] = d[i];
    }
    json.push(object);
  });
  
  return json;
}

// Get all sheet names
function getSheetNames() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const sheetNames = sheets.map(sheet => sheet.getName());
  return sheetNames;
}

// Add a new row with multiple columns
function appendRowData(sheetName, rowDataObj) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (sheet === null) {
    return { success: false, message: "Sheet not found" };
  }

  try {
    // Get headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create row array matching headers
    const rowData = headers.map(header => rowDataObj[header] || '');
    
    // Append the new row
    sheet.appendRow(rowData);
    return { success: true, message: "Row added successfully" };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Update a row by ID
function updateRowData(sheetName, id, rowDataObj) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (sheet === null) {
    return { success: false, message: "Sheet not found" };
  }

  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id') >= 0 ? headers.indexOf('id') : headers.indexOf('ID');
    
    if (idIndex === -1) {
      return { success: false, message: "ID column not found" };
    }

    // Find row with matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex].toString() === id.toString()) {
        // Update the row
        const rowData = headers.map(header => rowDataObj[header] || data[i][headers.indexOf(header)] || '');
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([rowData]);
        return { success: true, message: "Row updated successfully" };
      }
    }
    
    return { success: false, message: "ID not found" };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Delete a row by ID
function deleteRowData(sheetName, id) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (sheet === null) {
    return { success: false, message: "Sheet not found" };
  }

  try {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id') >= 0 ? headers.indexOf('id') : headers.indexOf('ID');
    
    if (idIndex === -1) {
      return { success: false, message: "ID column not found" };
    }

    // Find and delete row with matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex].toString() === id.toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: "Row deleted successfully" };
      }
    }
    
    return { success: false, message: "ID not found" };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// Main function to handle GET requests
function doGet(e) {
  try {
    const path = e.parameter.path;
    const action = e.parameter.action;
    let debugInfo = `doGet called. Path: ${path}, Action: ${action}`;

    if (action === 'read') {
      const jsonData = json(path);
      return ContentService
            .createTextOutput(JSON.stringify({debugInfo, data: jsonData}))
            .setMimeType(ContentService.MimeType.JSON);
            
    } else if (action === 'getSheets') {
      const sheetNames = getSheetNames();
      return ContentService
            .createTextOutput(JSON.stringify({debugInfo, data: sheetNames}))
            .setMimeType(ContentService.MimeType.JSON);
            
    } else if (action === 'write') {
      // New multi-column write support
      const params = e.parameter;
      delete params.path;
      delete params.action;
      
      const result = appendRowData(path, params);
      return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
            
    } else if (action === 'update') {
      const id = e.parameter.id;
      const params = e.parameter;
      delete params.path;
      delete params.action;
      
      const result = updateRowData(path, id, params);
      return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
            
    } else if (action === 'delete') {
      const id = e.parameter.id;
      const result = deleteRowData(path, id);
      return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
            
    } else {
      return ContentService
            .createTextOutput(`Invalid action. Debug: ${debugInfo}`)
            .setMimeType(ContentService.MimeType.TEXT);
    }
  } catch (error) {
    return ContentService
          .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
          .setMimeType(ContentService.MimeType.JSON);
  }
}
