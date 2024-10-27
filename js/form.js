<script>
    document.getElementById('contact-form').addEventListener('submit', function(event) {
      event.preventDefault();

      fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
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
  </script>
