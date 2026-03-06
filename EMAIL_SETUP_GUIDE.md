# Email Confirmation Setup Guide

## Overview
This system automatically sends a beautiful HTML email confirmation to every applicant who submits the form.

## Email Features
✅ Professional HTML design with gold/black theme
✅ Application details summary
✅ Next steps clearly outlined
✅ Automatic sending (no manual work needed)
✅ Plain text fallback for all email clients
✅ Mobile responsive design

## Setup Instructions

### Step 1: Update Google Apps Script

1. Go to https://script.google.com/
2. Open your existing project
3. **Delete all existing code**
4. Copy the entire code from `google-apps-script-with-email.js`
5. Paste it into the editor
6. Save (Ctrl+S)

### Step 2: Test the Email (Optional but Recommended)

Before deploying, test how the email looks:

1. In the script editor, find the `testEmail()` function at the bottom
2. Replace `'your-email@example.com'` with your actual email address
3. Select `testEmail` from the function dropdown at the top
4. Click Run (▶️)
5. Authorize the script to send emails (first time only):
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
6. Check your email inbox for the test confirmation email

### Step 3: Deploy the Updated Script

1. Click "Deploy" → "Manage deployments"
2. Click the edit icon (pencil) on your existing deployment
3. Under "Version", select "New version"
4. Add description: "Added email confirmation system"
5. Click "Deploy"
6. The URL remains the same (no need to update React app)

### Step 4: Test from Website

1. Go to http://localhost:5174/
2. Click "Apply For Invitation"
3. Fill the form with a real email address (yours for testing)
4. Submit the form
5. Check your email - you should receive the confirmation within seconds

## Email Content

The confirmation email includes:

### Header
- The 1% Matchmaking logo
- "By Invitation Only" tagline

### Body
- Personal greeting with applicant's name
- Application confirmation message
- Application details box:
  - Event interest
  - Application date
  - Status (Pending Verification)
- Next steps section with 4-step process
- Important notes about verification and refund policy
- Professional signature

### Footer
- Brand tagline
- Copyright notice
- Contact information

## Troubleshooting

### Email not received?

1. **Check spam/junk folder** - First-time emails might go to spam
2. **Check Apps Script execution log**:
   - In Apps Script editor, click "Executions" (clock icon)
   - Look for errors in the latest execution
3. **Verify email address** - Make sure the email in the form is correct
4. **Check authorization** - Script must be authorized to send emails

### Email looks broken?

- The email is designed with HTML and should work in all major email clients
- If it looks plain, the email client might not support HTML (rare)
- A plain text version is automatically included as fallback

### Authorization issues?

If you see "Authorization required":
1. Run the `testEmail()` function first
2. Complete the authorization flow
3. Then deploy and test from website

## Customization

You can customize the email by editing the `sendConfirmationEmail()` function:

### Change email content:
- Edit the `htmlBody` variable for HTML version
- Edit the `plainTextBody` variable for plain text version

### Change sender name:
- Find `name: "The 1% Matchmaking"` in the `MailApp.sendEmail()` call
- Change to your preferred sender name

### Add more details:
- Access any form field using `data.fieldName`
- Example: `data.age`, `data.profession`, `data.city`

## Email Delivery Notes

- Emails are sent instantly when form is submitted
- Uses Gmail's sending infrastructure (reliable)
- Daily sending limit: 100 emails per day (Gmail free account)
- For higher volume, consider upgrading to Google Workspace

## Privacy & Compliance

- Email addresses are only used for confirmation emails
- No third-party email services involved
- All data stays within your Google account
- Complies with standard email best practices

## Next Steps

After setup:
1. Test with your own email first
2. Test with a friend's email
3. Monitor the first few real submissions
4. Check spam rates and adjust if needed
5. Consider adding admin notification emails (optional)

## Optional: Admin Notification

To receive an email when someone applies, add this to the `doPost` function after the confirmation email:

```javascript
// Send notification to admin
MailApp.sendEmail({
  to: 'admin@yourdomain.com',
  subject: 'New Application - ' + data.name,
  body: `New application received from ${data.name} (${data.email}) for ${data.eventInterest}`
});
```

Replace `admin@yourdomain.com` with your email address.
