import emailjs from '@emailjs/browser';

window.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  var toast = document.getElementById('contact-toast');
  
  if (form && toast) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      var submitButton = form.querySelector('button[type="submit"]');
      var originalText = submitButton.innerHTML;
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
      
      try {
        var formData = new FormData(form);
        await emailjs.send(
          'service_idnjelu', // Your EmailJS service ID
          'template_z6dosgs', // Your EmailJS template ID
          {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
          },
          '3uxXkNidPunCtPyph' // Your EmailJS user ID
        );
        
        toast.textContent = 'Message sent successfully! Thank you for reaching out.';
        toast.className = 'mt-4 text-center text-green-400 font-semibold opacity-100 transition-opacity duration-200';
        form.reset();
        
      } catch (error) {
        console.error('Email sending failed:', error);
        toast.textContent = 'Failed to send message. Please try again or contact me directly.';
        toast.className = 'mt-4 text-center text-red-400 font-semibold opacity-100 transition-opacity duration-200';
      } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Hide toast after 5 seconds
        setTimeout(function() {
          toast.style.opacity = '0';
          setTimeout(function() {
            toast.className = 'mt-4 text-center text-primary font-semibold opacity-0 transition-opacity duration-200';
          }, 200);
        }, 5000);
      }
    });
  }
});
