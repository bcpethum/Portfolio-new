# EmailJS Setup Guide for Your Portfolio

Your portfolio contact form is now integrated with EmailJS! Follow these steps to complete the setup:

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add an Email Service

1. Go to the [Email Services](https://dashboard.emailjs.com/admin) page
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. **Copy the Service ID** - you'll need this later

## Step 3: Create an Email Template

1. Go to [Email Templates](https://dashboard.emailjs.com/admin/templates)
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message from {{name}}

From: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. The template variables should match your form field names:
   - `{{name}}` - visitor's name
   - `{{email}}` - visitor's email
   - `{{subject}}` - message subject
   - `{{message}}` - message content

5. **Copy the Template ID** - you'll need this later

## Step 4: Get Your Public Key

1. Go to [Account Settings](https://dashboard.emailjs.com/admin/account)
2. Find your **Public Key** in the "API Keys" section
3. **Copy the Public Key**

## Step 5: Update Your Portfolio Code

Open `script.js` and replace the placeholder values:

```javascript
// Line 2-6: Replace YOUR_PUBLIC_KEY
emailjs.init({
    publicKey: "YOUR_ACTUAL_PUBLIC_KEY_HERE",
});

// Line 41-42: Replace Service and Template IDs
emailjs.sendForm(
    'YOUR_ACTUAL_SERVICE_ID',      // Replace with your Service ID
    'YOUR_ACTUAL_TEMPLATE_ID',     // Replace with your Template ID
    contactForm
)
```

### Example:
```javascript
emailjs.init({
    publicKey: "abc123XYZ789",
});

emailjs.sendForm(
    'service_abc1234',
    'template_xyz5678',
    contactForm
)
```

## Step 6: Test Your Contact Form

1. Open your portfolio in a browser
2. Fill out the contact form with test data
3. Click "Send Message"
4. Check your email inbox - you should receive the message!

## Free Tier Limits

EmailJS free plan includes:
- 200 emails per month
- 2 email services
- 2 email templates
- Basic email history

Perfect for a portfolio website!

## Troubleshooting

### Email not sending?
- Check browser console for errors (F12)
- Verify all IDs are correct (Service ID, Template ID, Public Key)
- Make sure your email service is properly connected in EmailJS dashboard
- Check EmailJS logs: [https://dashboard.emailjs.com/admin/logs](https://dashboard.emailjs.com/admin/logs)

### Getting errors?
- Make sure you replaced ALL three placeholder values
- Check that your form field names match the template variables
- Verify your EmailJS service is active

### Still having issues?
- Visit EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Check EmailJS support: [https://www.emailjs.com/docs/faq/](https://www.emailjs.com/docs/faq/)

## Security Note

Your Public Key is safe to expose in client-side code. However, you can add domain restrictions in your EmailJS account settings to prevent unauthorized use.

---

**Need Help?** Check the EmailJS documentation or their support resources!
