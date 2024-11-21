document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();

  grecaptcha.ready(function () {
      grecaptcha.render('custom-recaptcha', {
          sitekey: '6Ld3Y4UqAAAAAKWQYo1dmyHm2EDRfZDwQGR08hw1',
          badge: 'inline'
      });
  });

  
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  console.log("Form submission initiated...");

  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  const honeypotField = document.querySelector('input[name="_honey"]');
  const honeypotValue = honeypotField.value.trim();

  if (honeypotValue !== '') {
    showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
    submitButton.disabled = false;
    return;
  }

  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
    console.log("Submission blocked due to time limit.");
    showAlert("Form is already sent!", "You need to wait 10 minutes before submitting again.", "info", submitButton);
    submitButton.disabled = false;
    return;
  }

  console.log("Fetching reCAPTCHA token...");

  grecaptcha.ready(function () {
    grecaptcha.execute('6Ld3Y4UqAAAAAKWQYo1dmyHm2EDRfZDwQGR08hw1', { action: 'submit_form' })
      .then(function (token) {
        console.log("reCAPTCHA token successfully fetched!");

        const recaptchaTokenField = document.getElementById('token');
        recaptchaTokenField.value = token;

        submitForm(token, submitButton, currentTime);
      })
      .catch(function (error) {
        console.error("reCAPTCHA execution error:", error);
        showAlert("Oops!", "Failed to execute reCAPTCHA. Please reload the page and try again.", "error", submitButton);
        submitButton.disabled = false;
      });
  });
});

function submitForm(token, submitButton, currentTime) {
  console.log("Submitting form with token...");

  const recaptchaRequestBody = {
    event: {
      token: token,
      expectedAction: "submit_form",
      siteKey: "6Ld3Y4UqAAAAAKWQYo1dmyHm2EDRfZDwQGR08hw1"
    }
  };

  console.log("Sending reCAPTCHA verification request...");

  fetch('https://recaptchaenterprise.googleapis.com/v1/projects/caunter-request/assessments?key=AIzaSyAV83Y-SUJB-b2BOWZjvVNnmcbLNX4vdLE', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recaptchaRequestBody)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Parsed reCAPTCHA API response.");
      if (data.tokenProperties && data.tokenProperties.valid === true && data.riskAnalysis && data.riskAnalysis.score > 0.5) {
        console.log("reCAPTCHA verification passed. Fetching IP...");

        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(ipData => {
            const ipAddress = ipData.ip;
            console.log("IP Address fetched:", ipAddress);

            const recaptchaTokenField = document.getElementById('token');
            recaptchaTokenField.value = token;
            
            const formData = new FormData(document.getElementById('contact-form'));
            formData.append('IP', ipAddress);

            formData.delete('token');

            console.log("Sending form data to email...");
            fetch(document.getElementById('contact-form').action, {
              method: 'POST',
              body: formData,
              headers: { 'Accept': 'application/json' }
            })
              .then(response => {
                console.log("Form submission response:", response);

                if (response.ok) {
                  localStorage.setItem('lastSubmissionTime', currentTime);
                  showAlert("Thanks for reaching out!", "Expect a response shortly.", "success", submitButton)
                    .then(() => {
                      document.getElementById('contact-form').reset();
                      submitButton.disabled = false;
                    });
                } else {
                  console.log("Form submission failed.");
                  showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
                  submitButton.disabled = false;
                }
              })
              .catch(error => {
                console.error("Form submission error:", error);
                showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
                submitButton.disabled = false;
              });
          })
          .catch(error => {
            console.error("IP fetch error:", error);
            showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
            submitButton.disabled = false;
          });
      } else {
        console.log("reCAPTCHA verification failed: Invalid token or low score.");
        showAlert("reCAPTCHA verification failed!", "Please try again.", "error", submitButton);
        submitButton.disabled = false;
      }
    })
    .catch(error => {
      console.error("reCAPTCHA API error:", error);
      showAlert("Oops!", "Failed to verify reCAPTCHA. Please try again later.", "error", submitButton);
      submitButton.disabled = false;
    });
}

function showAlert(title, text, icon, button) {
  console.log("Displaying alert:", { title, text, icon });
  return swal({
    title: title,
    text: text,
    icon: icon,
    button: "Back to website"
  }).then(() => {
    button.disabled = false;
  });
}
