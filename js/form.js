    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault(); 

      const submitButton = document.getElementById('submitBtn');
      submitBtn.disabled = true;

      // Send the form data
      fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          swal({
            title: "Thanks!", 
            text: "Your form is successfully submitted!", 
            icon: "success",
            button: "Back to website"
          }).then(() => {
            document.getElementById('contact-form').reset();
            submitBtn.disabled = false;
          });
        } else {
          swal({
            title: "Oops!", 
            text: "There is some kind of error, try again later...", 
            icon: "error", 
            button: "Back to website"
          }).then(() => {
            submitBtn.disabled = false; 
          });
        }
      })
      .catch(error => {
        swal({
          title: "Oops!", 
          text: "There is some kind of error, try again later...", 
          icon: "error", 
          button: "Back to website"
        }).then(() => {
          submitBtn.disabled = false; 
        });
      });
    });
