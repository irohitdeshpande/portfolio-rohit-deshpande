# 📧 EMAIL SETUP GUIDE

## 🚀 Quick Setup for Contact Form Email Delivery

Your contact form is currently **logging messages to console**. To get emails delivered to your inbox, follow these steps:

### **Option 1: Resend (Recommended - Free & Reliable)**

1. **Sign up at [Resend.com](https://resend.com)**
2. **Verify your email address**
3. **Go to API Keys** in dashboard
4. **Create new API key** with full send permissions
5. **Add to your `.env` file:**
   ```bash
   RESEND_API_KEY=re_your-actual-key-here
   ```
6. **Restart your dev server** (`npm run dev`)
7. **Test the contact form** - you should receive emails!

**Free Tier:** 3,000 emails/month + 100 emails/day

---

### **Option 2: EmailJS (Client-side)**

1. **Go to [EmailJS.com](https://emailjs.com)**
2. **Create account** and verify email
3. **Add Email Service:**
   - Choose Gmail, Outlook, or your email provider
   - Connect and authorize your email account
4. **Create Email Template:**
   - Template variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
   - Set reply-to as `{{from_email}}`
5. **Get your credentials:**
   - **Public Key:** Account > General > Public Key
   - **Service ID:** Email Services > Your Service > Service ID  
   - **Template ID:** Email Templates > Your Template > Template ID
6. **Test using:** [http://localhost:4321/emailjs-debug.html](http://localhost:4321/emailjs-debug.html)
7. **Update contact form** with your credentials

**Free Tier:** 200 emails/month

---

### **Option 3: Discord Notifications (Instant)**

1. **Create Discord webhook:**
   - Server Settings > Integrations > Webhooks > New Webhook
   - Copy webhook URL
2. **Add to `.env` file:**
   ```bash
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
   ```
3. **Restart dev server**
4. **Test contact form** - get instant Discord notifications!

---

## 🧪 Testing Your Setup

### **Current Status Check:**
- ✅ **Console Logging:** Always works (check terminal)
- ❌ **Email Delivery:** Requires API key setup
- ❌ **Instant Notifications:** Requires webhook setup

### **Test Commands:**
```bash
# Test API endpoint directly
node test-contact.js

# Test EmailJS configuration
open http://localhost:4321/emailjs-debug.html

# Check server logs
npm run dev (watch terminal for contact submissions)
```

### **Debugging:**
- **No emails received:** Check API keys in `.env` file
- **Console errors:** Check browser developer tools
- **Server errors:** Check terminal running `npm run dev`

---

## 🔒 Production Deployment

### **For Vercel:**
1. **Add environment variables** in Vercel dashboard:
   - `RESEND_API_KEY`
   - `DISCORD_WEBHOOK_URL` (optional)
2. **Redeploy** your project
3. **Test** contact form on live site

### **For other platforms:**
- Ensure environment variables are properly set
- Restart/redeploy after adding API keys

---

## 💡 Recommended Setup

**For maximum reliability:**

1. **Resend API** (primary email delivery)
2. **Discord webhook** (instant notifications)  
3. **Console logging** (backup - always works)

This gives you **triple redundancy** - if one method fails, others still work!

---

## 🆘 Need Help?

- **EmailJS not working:** Use the debug tool at `/emailjs-debug.html`
- **Resend issues:** Check API key permissions and rate limits
- **Still no emails:** Contact form data is always logged to console as backup

Your contact form **already works** - it's logging all submissions. Adding email delivery just makes it more convenient! 🎉
