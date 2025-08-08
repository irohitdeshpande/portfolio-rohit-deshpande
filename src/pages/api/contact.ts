/**
 * 📧 ENHANCED CONTACT FORM API ENDPOINT
 * ====================================
 * 
 * Handles contact form submissions with multiple delivery methods:
 * 1. Resend API (primary - reliable email delivery)
 * 2. Console logging (always works)
 * 3. Webhook notifications (optional)
 */

export const prerender = false;

// Email sending function using multiple methods
async function sendContactEmail(formData: any) {
  const { name, email, subject, message } = formData;
  const timestamp = new Date().toISOString();
  
  // Always log to console (guaranteed to work)
  console.log('📧 Contact Form Submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log(`Timestamp: ${timestamp}`);
  
  const results = [];
  
  // Method 1: Try Resend API (if configured)
  try {
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    
    if (RESEND_API_KEY) {
      console.log('🚀 Attempting to send via Resend...');
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>', // Default Resend address
          to: ['rohitsdeshpande4work@gmail.com'],
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                📧 New Contact Form Submission
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">Contact Details:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
                <h3 style="color: #495057; margin-top: 0;">Message:</h3>
                <p style="line-height: 1.6; color: #6c757d;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #0c5460;">
                  <strong>Timestamp:</strong> ${timestamp}<br>
                  <strong>Reply to:</strong> <a href="mailto:${email}?subject=Re: ${subject}">${email}</a>
                </p>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Timestamp: ${timestamp}
Reply to: ${email}
          `.trim()
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resend email sent successfully:', result);
        results.push({ method: 'Resend', status: 'success', id: result.id });
      } else {
        const error = await response.text();
        console.error('❌ Resend failed:', error);
        results.push({ method: 'Resend', status: 'failed', error });
      }
    } else {
      console.log('⚠️ Resend API key not configured');
      results.push({ method: 'Resend', status: 'not_configured' });
    }
  } catch (error) {
    console.error('💥 Resend error:', error);
    results.push({ method: 'Resend', status: 'error', error: String(error) });
  }
  
  // Method 2: Webhook to Discord (example)
  try {
    const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL;
    
    if (DISCORD_WEBHOOK_URL) {
      console.log('🚀 Sending to Discord webhook...');
      
      const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '📧 New Portfolio Contact',
            color: 0x007bff,
            fields: [
              { name: '👤 Name', value: name, inline: true },
              { name: '📧 Email', value: email, inline: true },
              { name: '📝 Subject', value: subject, inline: false },
              { name: '💬 Message', value: message.length > 1000 ? message.substring(0, 1000) + '...' : message, inline: false }
            ],
            timestamp: timestamp,
            footer: { text: 'Portfolio Contact Form' }
          }]
        })
      });
      
      if (discordResponse.ok) {
        console.log('✅ Discord webhook sent successfully');
        results.push({ method: 'Discord', status: 'success' });
      } else {
        console.error('❌ Discord webhook failed');
        results.push({ method: 'Discord', status: 'failed' });
      }
    } else {
      results.push({ method: 'Discord', status: 'not_configured' });
    }
  } catch (error) {
    console.error('💥 Discord webhook error:', error);
    results.push({ method: 'Discord', status: 'error', error: String(error) });
  }
  
  // Method 3: Always successful console logging
  results.push({ method: 'Console', status: 'success' });
  
  return results;
}

export async function POST({ request }: { request: Request }) {
  try {
    console.log('📧 Contact form submission received');
    
    // Parse form data
    const contentType = request.headers.get('content-type');
    let formData;
    
    if (contentType?.includes('application/json')) {
      formData = await request.json();
    } else if (contentType?.includes('multipart/form-data') || contentType?.includes('application/x-www-form-urlencoded')) {
      const rawFormData = await request.formData();
      formData = {
        name: rawFormData.get('name'),
        email: rawFormData.get('email'),
        subject: rawFormData.get('subject'),
        message: rawFormData.get('message')
      };
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid content type'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate required fields
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'All fields are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`📝 Processing contact from: ${name} (${email})`);
    
    // Send email using multiple methods
    const deliveryResults = await sendContactEmail(formData);
    
    // Check if any delivery method was successful
    const successfulDeliveries = deliveryResults.filter(r => r.status === 'success');
    const hasEmailDelivery = deliveryResults.some(r => 
      r.method === 'Resend' && r.status === 'success'
    );
    
    return new Response(JSON.stringify({
      success: true,
      message: hasEmailDelivery 
        ? 'Message sent successfully via email! I will get back to you soon.'
        : 'Message received and logged! I will get back to you soon.',
      data: {
        name,
        email,
        subject,
        timestamp: new Date().toISOString(),
        deliveryResults: deliveryResults
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error. Please try again or contact me directly.',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
