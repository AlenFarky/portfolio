document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const captchaResponse = document.querySelector('input[name="cf-turnstile-response"]').value;
    
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
                    this.reset(); // Reset the form on success
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
