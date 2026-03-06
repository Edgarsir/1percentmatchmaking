function doPost(e) {
  try {
    // Check if e and e.postData exist
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('Error: Invalid request - missing postData');
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Invalid request: missing postData'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Post data: ' + e.postData.contents);
    
    // Parse the incoming JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('JSON parse error: ' + parseError.toString());
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        message: 'Invalid JSON: ' + parseError.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    
    // If this is the first entry, add headers
    if (sheet.getLastRow() === 0) {
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
      
      Logger.log('Headers added');
    }
    
    // Append the new row with matchmaking form data
    const newRow = [
      data.timestamp || new Date().toISOString(),
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
    ];
    
    Logger.log('Adding row: ' + JSON.stringify(newRow));
    sheet.appendRow(newRow);
    Logger.log('Row added successfully at row: ' + sheet.getLastRow());
    
    // Send confirmation email to applicant
    try {
      sendConfirmationEmail(data);
      Logger.log('Confirmation email sent to: ' + data.email);
    } catch (emailError) {
      Logger.log('Email error: ' + emailError.toString());
      // Don't fail the whole request if email fails
    }
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Application submitted successfully',
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to send beautiful HTML confirmation email
function sendConfirmationEmail(data) {
  const recipientEmail = data.email;
  const recipientName = data.name;
  const eventInterest = data.eventInterest;
  
  const subject = "Application Received - The 1% Matchmaking";
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
      background-color: #0f0f0f;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111111;
      border: 1px solid #d4af37;
    }
    .header {
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #d4af37;
    }
    .logo {
      font-size: 24px;
      color: #d4af37;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
      color: #cfcfcf;
      line-height: 1.8;
    }
    .greeting {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .highlight {
      color: #d4af37;
      font-weight: bold;
    }
    .info-box {
      background-color: #0f0f0f;
      border-left: 3px solid #d4af37;
      padding: 20px;
      margin: 30px 0;
    }
    .info-box h3 {
      color: #d4af37;
      margin-top: 0;
      font-size: 16px;
      letter-spacing: 1px;
    }
    .info-item {
      margin: 10px 0;
      color: #cfcfcf;
      font-size: 14px;
    }
    .next-steps {
      background-color: #1a1a1a;
      padding: 25px;
      margin: 30px 0;
      border-radius: 5px;
    }
    .next-steps h3 {
      color: #d4af37;
      margin-top: 0;
      font-size: 18px;
      letter-spacing: 1px;
    }
    .step {
      margin: 15px 0;
      padding-left: 25px;
      position: relative;
      color: #cfcfcf;
    }
    .step:before {
      content: "→";
      position: absolute;
      left: 0;
      color: #d4af37;
      font-weight: bold;
    }
    .footer {
      background-color: #0a0a0a;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #d4af37;
    }
    .footer p {
      margin: 5px 0;
      color: #888888;
      font-size: 12px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #d4af37, transparent);
      margin: 30px 0;
    }
    .signature {
      margin-top: 30px;
      color: #cfcfcf;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">THE 1% MATCHMAKING</h1>
      <p style="color: #d4af37; font-size: 12px; letter-spacing: 3px; margin: 10px 0 0 0;">BY INVITATION ONLY</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${recipientName},</p>
      
      <p>Thank you for your interest in <span class="highlight">The 1% Matchmaking</span>. We have successfully received your application for our exclusive matchmaking event.</p>
      
      <div class="divider"></div>
      
      <!-- Application Details -->
      <div class="info-box">
        <h3>YOUR APPLICATION DETAILS</h3>
        <div class="info-item"><strong>Event Interest:</strong> ${eventInterest}</div>
        <div class="info-item"><strong>Application Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div class="info-item"><strong>Status:</strong> <span style="color: #d4af37;">Pending Verification</span></div>
      </div>
      
      <!-- Next Steps -->
      <div class="next-steps">
        <h3>WHAT HAPPENS NEXT?</h3>
        <div class="step">Our relationship manager will review your application within 24-48 hours</div>
        <div class="step">You will receive a verification call or Google Meet invitation</div>
        <div class="step">Upon approval, you'll receive a private payment link</div>
        <div class="step">Your official event invitation will be sent via email & WhatsApp</div>
      </div>
      
      <div class="divider"></div>
      
      <p>We maintain the highest standards of curation to ensure every guest meets our eligibility criteria. This verification process helps us create the perfect environment for meaningful connections.</p>
      
      <p><strong>Please note:</strong> If your application does not meet our criteria, a full refund will be processed within 48 hours.</p>
      
      <div class="signature">
        <p>Warm regards,<br>
        <span class="highlight">The 1% Matchmaking Team</span></p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p style="color: #d4af37; font-size: 14px; margin-bottom: 15px;">EXCLUSIVE • CURATED • VERIFIED</p>
      <p>This is an automated confirmation email.</p>
      <p>For inquiries, please reply to this email.</p>
      <p style="margin-top: 20px;">© 2026 The 1% Matchmaking. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  // Plain text version for email clients that don't support HTML
  const plainTextBody = `
Dear ${recipientName},

Thank you for your interest in The 1% Matchmaking. We have successfully received your application for our exclusive matchmaking event.

YOUR APPLICATION DETAILS
Event Interest: ${eventInterest}
Application Date: ${new Date().toLocaleDateString('en-IN')}
Status: Pending Verification

WHAT HAPPENS NEXT?
→ Our relationship manager will review your application within 24-48 hours
→ You will receive a verification call or Google Meet invitation
→ Upon approval, you'll receive a private payment link
→ Your official event invitation will be sent via email & WhatsApp

We maintain the highest standards of curation to ensure every guest meets our eligibility criteria. This verification process helps us create the perfect environment for meaningful connections.

Please note: If your application does not meet our criteria, a full refund will be processed within 48 hours.

Warm regards,
The 1% Matchmaking Team

---
EXCLUSIVE • CURATED • VERIFIED
© 2026 The 1% Matchmaking. All rights reserved.
  `;
  
  // Send the email
  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    body: plainTextBody,
    htmlBody: htmlBody,
    name: "The 1% Matchmaking"
  });
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    message: 'Matchmaking form handler is active. Use POST to submit data.'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function you can run manually from the editor
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: 'Test User',
        email: 'test@example.com',
        age: '30',
        gender: 'Male',
        education: 'MBA',
        profession: 'Entrepreneur',
        city: 'Mumbai',
        contactNumber: '9876543210',
        maritalStatus: 'Single',
        eventInterest: 'Elite Doctors Evening - Mumbai'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}

// Test email function - run this to see how the email looks
function testEmail() {
  const testData = {
    name: 'Test User',
    email: 'your-email@example.com', // Replace with your email to test
    eventInterest: 'Elite Doctors Evening - Mumbai'
  };
  
  sendConfirmationEmail(testData);
  Logger.log('Test email sent!');
}
