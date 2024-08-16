document.getElementById('infoForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Stop the form from submitting normally

    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;

    // Send the data using Fetch API
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&company=${encodeURIComponent(company)}&email=${encodeURIComponent(email)}`
    })
    .then(response => {
        if (response.ok) {
            // Display the message
            document.getElementById('message').innerText = 'Thank you! \nNow you can use the GPT environment!! \n\nRedirecting in 3 seconds...';
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'gpt.html';
            }, 3000);
        } else {
            document.getElementById('message').innerText = 'Failed to submit data.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Error submitting form.';
    });
});
