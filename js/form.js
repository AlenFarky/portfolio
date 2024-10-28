document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
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

  // Gather form data
  const formData = {
    name: document.getElementById('InputName').value,
    email: document.getElementById('InputEmail').value,
    message: document.getElementById('InputMessage').value,
    '_captcha': false, // You can adjust based on your FormSubmit settings
    '_honey': '',      // Spam prevention field
    '_subject': 'Form Submission', 
  };

  fetch("https://formsubmit.co/ajax/c1a4565bb0ee860e10689d63fbed3dca", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: "no-cors",
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
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
        throw new Error("Form submission failed");
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
