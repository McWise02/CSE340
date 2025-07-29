document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.getElementById("togglePassword");

  if (passwordInput && toggleButton) {
    toggleButton.addEventListener("click", function () {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
    });
  }
});