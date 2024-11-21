document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
    showAlert("Form is already sent!", "You need to wait 10 minutes before submitting again.", "info", submitButton);
    return;
  }

  // Fetch the user's IP address
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const ipAddress = data.ip;
      const formData = new FormData(this);

      // Append the IP address to the form data
      formData.append('IP Address', ipAddress);

      fetch(this.action, {
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
          showAlert("Oops!", "We encountered an issue, please try again in a bit.", "error", submitButton);
        });
    })
    .catch(error => {
      showAlert("Oops!", "Could not fetch your IP address. Please try again later.", "error", submitButton);
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
