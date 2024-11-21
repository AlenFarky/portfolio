document.addEventListener('DOMContentLoaded', function () {
    turnstile.render('.cf-turnstile', {
        sitekey: '0x4AAAAAAA0lA7ubfueW3nYV',
        callback: function (token) {
            const captchaResponseField = document.getElementById('cf-turnstile-response');
            if (captchaResponseField) {
                captchaResponseField.value = token;
            } else {
                console.error('Hidden input for CAPTCHA response not found.');
            }
        },
    });
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const captchaResponse = document.getElementById('cf-turnstile-response');
    if (!captchaResponse || !captchaResponse.value) {
        showAlert('Captcha Required', 'Please complete the CAPTCHA.', 'error', submitButton);
        submitButton.disabled = false;
        return;
    }

    const formData = new FormData(this);
    formData.append('cf-turnstile-response', captchaResponse.value);

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
