// Google Apps Script for handling form submissions
// Deploy this as a Web App in Google Apps Script

// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Copy this code into the script editor
// 4. Create a new Google Sheet or use existing one
// 5. Replace SPREADSHEET_ID below with your Google Sheet ID
// 6. Deploy as Web App:
//    - Click "Deploy" > "New deployment"
//    - Select type: "Web app"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
//    - Click "Deploy"
// 7. Copy the Web App URL and paste it in App.jsx as googleScriptURL

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Applications'; // Name of the sheet tab

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    Logger.log('Received data: ' + JSON.stringify(data));
    
    // Open the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Email',
        'Age',
        'Gender',
        'Education',
        'Profession',
        'City',
        'Contact Number',
        'Marital Status',
        'Event Interest',
        'Status'
      ]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground('#d4af37');
      headerRange.setFontColor('#000000');
      headerRange.setFontWeight('bold');
    }
    
    // Append the data in the correct order
    sheet.appendRow([
      new Date(data.timestamp),
      data.name || '',
      data.email || '',
      data.age || '',
      data.gender || '',
      data.education || '',
      data.profession || '',
      data.city || '',
      data.contactNumber || '',
      data.maritalStatus || '',
      data.eventInterest || '',
      'Pending Review'
    ]);
    
    // Optional: Send email notification to admin
    // Uncomment and configure if needed
    /*
    MailApp.sendEmail({
      to: 'admin@yourdomain.com',
      subject: 'New Application Received - 1% Matchmaking',
      body: `
        New application received:
        
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.contactNumber}
        Event: ${data.eventInterest}
        
        Please review in the Google Sheet.
      `
    });
    */
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Application submitted successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Form handler is active. Use POST to submit data.' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify setup
function testSetup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log('Spreadsheet found: ' + ss.getName());
  
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found, will be created on first submission');
  } else {
    Logger.log('Sheet found: ' + sheet.getName());
  }
}
