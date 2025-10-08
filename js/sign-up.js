
  function validateForm() {
    const email = document.getElementById('emailInput').value.trim();
    const gdprChecked = document.getElementById('gdpr').checked;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      alert("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!gdprChecked) {
      alert("Please accept the GDPR terms before submitting.");
      return;
    }

    alert("Thank you for signing up!");
  }
