// Contact Form Handler with EmailJS and API Fallback
(function() {
  // Wait for EmailJS to load
  function initContactForm() {
    var form = document.getElementById('contact-form');
    var toast = document.getElementById('contact-toast');
    
    if (!form || !toast) {
      console.error('Contact form or toast element not found');
      return;
    }

    // Initialize EmailJS if available
    var emailjsAvailable = false;
    if (typeof emailjs !== 'undefined') {
      emailjs.init('3uxXkNidPunCtPyph'); // Your EmailJS public key
      emailjsAvailable = true;
      console.log('EmailJS initialized successfully');
    } else {
      console.warn('EmailJS not loaded, will use API fallback');
    }
    
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      var submitButton = form.querySelector('button[type="submit"]');
      var originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = `
        <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      `;
      submitButton.disabled = true;
      
      toast.textContent = 'Sending your message...';
      toast.style.opacity = '1';
      toast.className = 'mt-4 text-center text-blue-400 font-semibold opacity-100 transition-opacity duration-200';
      
      try {
        // Get form data
        var formData = new FormData(form);
        var success = false;
        
        // Try EmailJS first (if available)
        if (emailjsAvailable) {
          try {
            console.log('Attempting to send via EmailJS...');
            var result = await emailjs.send(
              'service_idnjelu', // Your EmailJS service ID
              'template_z6dosgs', // Your EmailJS template ID
              {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: 'rohitsdeshpande4work@gmail.com'
              }
            );
            
            console.log('EmailJS success:', result);
            success = true;
            
          } catch (emailjsError) {
            console.warn('EmailJS failed, trying API fallback:', emailjsError);
          }
        }
        
        // Fallback to API endpoint if EmailJS failed or unavailable
        if (!success) {
          console.log('Attempting to send via API...');
          var apiResponse = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.get('name'),
              email: formData.get('email'),
              subject: formData.get('subject'),
              message: formData.get('message')
            })
          });
          
          if (apiResponse.ok) {
            var apiResult = await apiResponse.json();
            console.log('API success:', apiResult);
            success = true;
          } else {
            throw new Error('API request failed');
          }
        }
        
        if (success) {
          // Show success message
          toast.textContent = '✅ Message sent successfully! Thank you for reaching out.';
          toast.className = 'mt-4 text-center text-green-400 font-semibold opacity-100 transition-opacity duration-200';
          form.reset();
        }
        
      } catch (error) {
        console.error('All sending methods failed:', error);
        
        // Show error message with fallback options
        toast.innerHTML = `
          ❌ Unable to send message automatically.<br>
          <span class="text-sm">Please email me directly at: 
          <a href="mailto:rohitsdeshpande4work@gmail.com" class="text-blue-400 hover:text-blue-300 underline">
            rohitsdeshpande4work@gmail.com
          </a></span>
        `;
        toast.className = 'mt-4 text-center text-red-400 font-semibold opacity-100 transition-opacity duration-200';
      } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Hide toast after 8 seconds (longer for error message)
        setTimeout(function() {
          toast.style.opacity = '0';
          setTimeout(function() {
            toast.className = 'mt-4 text-center text-primary font-semibold opacity-0 transition-opacity duration-200';
            toast.innerHTML = ''; // Clear any HTML content
          }, 200);
        }, 8000);
      }
    });
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
