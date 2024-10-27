document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();


  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.disabled = true;


  const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
  const currentTime = new Date().getTime();

  if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {

    swal({
      title: "Form is already sent!",
      text: "You need to wait 10 minutes before submitting again.",
      icon: "info",
      button: "Back to website"
    }).then(() => {

      submitButton.disabled = false;
    });
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

      swal({
        title: "Thanks for reaching out!",
        text: "Expect a response shortly.",
        icon: "success",
        button: "Back to website"
      }).then(() => {
        document.getElementById('contact-form').reset();

        submitButton.disabled = false;
      });
    } else {
      swal({
        title: "Oops!",
        text: "We encountered an issue, please try again in a bit.",
        icon: "error",
        button: "Back to website"
      }).then(() => {

        submitButton.disabled = false;
      });
    }
  })
  .catch(error => {
    swal({
      title: "Oops!",
      text: "We encountered an issue, please try again in a bit.",
      icon: "error",
      button: "Back to website"
    }).then(() => {

      submitButton.disabled = false;
    });
  });
});
