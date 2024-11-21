document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
    const currentTime = new Date().getTime();

    const captchaResponse = document.querySelector('input[name="cf-turnstile-response"]').value;
    console.log('Captcha Response:', captchaResponse);

    // Honeypot Field
    const honeypotField = document.querySelector('input[name="_honey"]');
    const honeypotValue = honeypotField.value.trim();

    if (lastSubmissionTime && currentTime - lastSubmissionTime < 10 * 60 * 1000) {
        return showAlert('Form is already sent!', 'You need to wait 10 minutes before submitting again.', 'info', submitButton);
    }

    // Prepare the form data
    const formData = new FormData(this);

    // Check if the captcha response is already in the form data
    if (!formData.has('cf-turnstile-response')) {
        formData.append('cf-turnstile-response', captchaResponse); // Only append if it's missing
    }

    fetch(this.action, {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.alert) {
                showAlert(data.alert.title, data.alert.text, data.alert.icon, submitButton);
                if (data.alert.icon === 'success') {
                    localStorage.setItem('lastSubmissionTime', currentTime);
                    this.reset();
                }
            }
        })
        .catch(() => {
            showAlert('Oops!', 'Error submitting the form. Please try again.', 'error', submitButton);
        });

    function showAlert(title, text, icon, button) {
        return swal({
            title: title,
            text: text,
            icon: icon,
            button: 'Back to website',
        }).then(() => {
            button.disabled = false;
        });
    }
});
