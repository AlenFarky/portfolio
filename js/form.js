document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const captchaResponse = document.querySelector('input[name="cf-turnstile-response"]').value;
    
    const formData = new FormData(this);

    // Check if the captcha response is already in the form data
    if (!formData.has('cf-turnstile-response')) {
        formData.append('cf-turnstile-response', captchaResponse);
    }

    fetch(this.action, {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.alert) {
                showAlert(data.alert.title, data.alert.text, data.alert.icon)
                    .then(() => {
                        submitButton.disabled = false;
                        if (data.alert.icon === 'success') {
                            this.reset();
                        }
                    });
            }
        })
        .catch(() => {
            showAlert('Oops!', 'Error submitting the form. Please try again.', 'error')
                .then(() => {
                    submitButton.disabled = false;
                });
        });

    function showAlert(title, text, icon) {
        return Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2400
        });
    }
});


