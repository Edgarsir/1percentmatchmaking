# Google Sheets Integration Setup Guide

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "1% Matchmaking Applications" (or any name you prefer)
4. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Example: If URL is `https://docs.google.com/spreadsheets/d/1abc123xyz/edit`
   - Then SPREADSHEET_ID is: `1abc123xyz`

## Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "+ New project"
3. Delete the default code
4. Copy the entire code from `google-apps-script.js` file
5. Paste it into the script editor
6. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID from Step 1
7. Click the disk icon to save (or Ctrl+S)
8. Name your project: "1% Matchmaking Form Handler"

## Step 3: Deploy as Web App

1. In the Apps Script editor, click "Deploy" > "New deployment"
2. Click the gear icon ⚙️ next to "Select type"
3. Select "Web app"
4. Configure the deployment:
   - **Description**: "Form submission handler"
   - **Execute as**: "Me" (your Google account)
   - **Who has access**: "Anyone"
5. Click "Deploy"
6. Review permissions:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. Copy the "Web app URL" (it will look like: `https://script.google.com/macros/s/...../exec`)

## Step 4: Update React App

1. Open `src/App.jsx`
2. Find this line near the top:
   ```javascript
   const googleScriptURL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL from Step 3
4. Save the file

## Step 5: Test the Integration

1. Run your React app: `npm run dev`
2. Click "Apply For Invitation" button
3. Fill out the form with test data
4. Click "Submit Application"
5. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

### Form submission shows error
- Verify the Web App URL is correct in `App.jsx`
- Make sure the Apps Script is deployed with "Anyone" access
- Check the Apps Script execution log for errors

### Data not appearing in Google Sheet
- Verify the SPREADSHEET_ID in the Apps Script is correct
- Make sure you authorized the script to access your Google Sheets
- Check if the sheet tab is named "Applications" (or update SHEET_NAME in script)

### CORS errors in browser console
- This is normal with `mode: 'no-cors'` in the fetch request
- The form will still work, but you won't see the response
- The success message is shown optimistically

## Sheet Structure

The script automatically creates a sheet with these columns:
1. Timestamp
2. Name
3. Age
4. Gender
5. Education
6. Profession
7. City
8. Contact Number
9. Email
10. Marital Status
11. Event Interest
12. Status (defaults to "Pending Review")

## Optional: Email Notifications

To receive email notifications when someone submits the form:

1. In the Apps Script, find the commented section:
   ```javascript
   /*
   MailApp.sendEmail({
     to: 'admin@yourdomain.com',
     ...
   });
   */
   ```
2. Uncomment it (remove `/*` and `*/`)
3. Replace `admin@yourdomain.com` with your email
4. Save and redeploy the script

## Security Notes

- The Web App URL is public but only accepts POST requests
- No sensitive data is exposed in the client-side code
- All submissions are logged with timestamps
- You can add additional validation in the Apps Script if needed

## Managing Applications

You can add additional columns to track:
- Verification status
- Approval date
- Payment status
- Event assignment
- Notes

The Google Sheet acts as your admin panel for managing applications.
