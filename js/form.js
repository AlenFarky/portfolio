document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  const honeypotField = document.querySelector('input[name="_honey"]');
  const honeypotValue = honeypotField.value.trim();

  // Check honeypot field
  if (honeypotValue !== '') {
    showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
    return; // Stop form submission
  }

  // Check submission time limit (10 minutes)
  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
    showAlert("Form is already sent!", "You need to wait 10 minutes before submitting again.", "info", submitButton);
    return;
  }

  // Validate reCAPTCHA token
  const recaptchaTokenField = document.getElementById('token');
  const recaptchaToken = recaptchaTokenField.value;

  if (!recaptchaToken || recaptchaToken.length < 50) {
    showAlert("Oops!", "reCAPTCHA verification failed. Please reload the page and try again.", "error", submitButton);
    return; // Stop form submission
  }

  // Verify reCAPTCHA token via the Enterprise API
  const recaptchaRequestBody = {
    event: {
      token: recaptchaToken,
      expectedAction: "submit_form",
      siteKey: "6Ld3Y4UqAAAAAKWQYo1dmyHm2EDRfZDwQGR08hw1"
    }
  };

  fetch('https://recaptchaenterprise.googleapis.com/v1/projects/caunter-request/assessments?key=AIzaSyAV83Y-SUJB-b2BOWZjvVNnmcbLNX4vdLE', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recaptchaRequestBody)
  })
    .then(response => response.json())
    .then(data => {
      if (data.tokenProperties.valid && data.score > 0.5) {
        // Token is valid, proceed to send form data
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(ipData => {
            const ipAddress = ipData.ip;
            const formData = new FormData(document.getElementById('contact-form'));
            formData.append('IP Address', ipAddress);

            fetch(document.getElementById('contact-form').action, {
              method: 'POST',
              body: formData,
              headers: { 'Accept': 'application/json' }
            })
              .then(response => {
                if (response.ok) {
                  localStorage.setItem('lastSubmissionTime', currentTime);
                  showAlert("Thanks for reaching out!", "Expect a response shortly.", "success", submitButton)
                    .then(() => {
                      document.getElementById('contact-form').reset();
                      submitButton.disabled = false;
                    });
                } else {
                  showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
                }
              })
              .catch(error => {
                console.error('Form submission error:', error);
                showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
              });
          })
          .catch(error => {
            console.error('IP fetch error:', error);
            showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
            submitButton.disabled = false;
          });
      } else {
        // Token is invalid or score is too low
        showAlert("reCAPTCHA verification failed!", "Please try again.", "error", submitButton);
        submitButton.disabled = false;
      }
    })
    .catch(error => {
      console.error('reCAPTCHA API error:', error);
      showAlert("Oops!", "Failed to verify reCAPTCHA. Please try again later.", "error", submitButton);
      submitButton.disabled = false;
    });

  function showAlert(title, text, icon, button) {
    return swal({
      title: title,
      text: text,
      icon: icon,
      button: "Back to website"
    }).then(() => {
      button.disabled = false;
    });
  }
});
