document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Check if the user is within the cooldown period
  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
    // Show error alert if within cooldown period (10 minutes)
    swal({
      title: "Form is already sent!",
      text: "You need to wait 10 minutes before submitting again.",
      icon: "info",
      button: "Back to website"
    });
    return;
  }

  // If not within cooldown, proceed with form submission
  fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      // Store the current time as the last successful submission time
      localStorage.setItem('lastSubmissionTime', currentTime);

      swal({
        title: "Thanks for reaching out!",
        text: "Expect a response shortly.",
        icon: "success",
        button: "Back to website"
      }).then(() => {
        document.getElementById('contact-form').reset();
      });
    } else {
      swal({
        title: "Oops!",
        text: "We encountered an issue, please try again in a bit.",
        icon: "error",
        button: "Back to website"
      });
    }
  })
  .catch(error => {
    swal({
      title: "Oops!",
      text: "We encountered an issue, please try again in a bit.",
      icon: "error",
      button: "Back to website"
    });
  });
});
