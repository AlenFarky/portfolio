document.addEventListener('DOMContentLoaded', function () {
    // Turnstile will auto-render based on the `cf-turnstile` class
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        // Adding a small delay to ensure Turnstile response has time to populate
        setTimeout(function () {
            const captchaResponse = document.getElementById('cf-turnstile-response').value;

            if (!captchaResponse) {
                showAlert('Captcha Required', 'Please complete the CAPTCHA.', 'error', submitButton);
                submitButton.disabled = false;
                return;
            }

            const formData = new FormData(document.getElementById('contact-form'));
            formData.append('cf-turnstile-response', captchaResponse);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        showAlert('Success!', 'Your form has been submitted successfully.', 'success', submitButton);
                        document.getElementById('contact-form').reset();
                    } else {
                        showAlert('Captcha Failed', 'Please complete the CAPTCHA correctly.', 'error', submitButton);
                    }
                })
                .catch(() => {
                    showAlert('Error!', 'Something went wrong. Please try again.', 'error', submitButton);
                })
                .finally(() => {
                    submitButton.disabled = false;
                });
        }, 500); // Delay to allow Turnstile response time
    });

    function showAlert(title, text, icon, button) {
        return swal({
            title: title,
            text: text,
            icon: icon,
            button: 'OK',
        }).then(() => {
            button.disabled = false;
        });
    }
});
