document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;  

  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
    showAlert("Form is already sent!", "You need to wait 10 minutes before submitting again.", "info", submitButton);
    return;
  }

  fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
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
