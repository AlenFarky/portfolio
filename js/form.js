document.addEventListener('DOMContentLoaded', function () {
    // Turnstile will auto-render based on the `cf-turnstile` class
    const submitButton = document.querySelector('button[type="submit"]');
    const form = document.getElementById('contact-form');

    // Listen for Turnstile validation success
    const onCaptchaSuccess = () => {
        console.log('Captcha solved successfully');
    };

    // Attach the Turnstile success handler
    window.turnstile = window.turnstile || {};
    window.turnstile.onSuccess = onCaptchaSuccess;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        submitButton.disabled = true;

        const captchaResponse = document.getElementById('cf-turnstile-response').value;

        console.log('Captcha Response:', captchaResponse);

        if (!captchaResponse) {
            showAlert('Captcha Required', 'Please complete the CAPTCHA.', 'error', submitButton);
            submitButton.disabled = false;
            return;
        }

        const formData = new FormData(form);
        formData.append('cf-turnstile-response', captchaResponse);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    showAlert('Success!', 'Your form has been submitted successfully.', 'success', submitButton);
                    form.reset();
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
