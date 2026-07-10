(function () {
  "use strict";

  const form = document.getElementById("settings-form");
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const themeSelect = document.getElementById("theme");
  const saveButton = document.getElementById("save-button");

  const fields = {
    fullName: {
      input: fullNameInput,
      errorEl: document.getElementById("full-name-error"),
      validate: validateFullName,
    },
    email: {
      input: emailInput,
      errorEl: document.getElementById("email-error"),
      validate: validateEmail,
    },
  };

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function trimValue(value) {
    return value.trim();
  }

  function validateFullName(value) {
    const trimmed = trimValue(value);
    if (!trimmed) {
      return "Full name is required.";
    }
    return "";
  }

  function validateEmail(value) {
    const trimmed = trimValue(value);
    if (!trimmed) {
      return "Email address is required.";
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  }

  function setFieldError(field, message) {
    field.errorEl.textContent = message;
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(fieldKey, showError) {
    const field = fields[fieldKey];
    const message = field.validate(field.input.value);

    if (showError || message) {
      setFieldError(field, message);
    }

    return !message;
  }

  function isFormValid() {
    return Object.keys(fields).every(function (key) {
      return fields[key].validate(fields[key].input.value) === "";
    });
  }

  function updateSaveButton() {
    saveButton.disabled = !isFormValid();
  }

  function handleFieldInput(fieldKey) {
    const field = fields[fieldKey];
    const hasBeenTouched = field.input.dataset.touched === "true";

    if (hasBeenTouched) {
      validateField(fieldKey, true);
    }

    updateSaveButton();
  }

  function handleFieldBlur(fieldKey) {
    const field = fields[fieldKey];
    field.input.dataset.touched = "true";
    validateField(fieldKey, true);
    updateSaveButton();
  }

  function applyTheme(theme) {
    document.body.classList.toggle("theme-dark", theme === "dark");
  }

  function handleThemeChange() {
    applyTheme(themeSelect.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let allValid = true;

    Object.keys(fields).forEach(function (key) {
      fields[key].input.dataset.touched = "true";
      if (!validateField(key, true)) {
        allValid = false;
      }
    });

    updateSaveButton();

    if (!allValid) {
      const firstInvalid = Object.keys(fields).find(function (key) {
        return fields[key].validate(fields[key].input.value) !== "";
      });

      if (firstInvalid) {
        fields[firstInvalid].input.focus();
      }
      return;
    }

    const formData = {
      fullName: trimValue(fullNameInput.value),
      email: trimValue(emailInput.value),
      theme: themeSelect.value,
      emailNotifications: document.getElementById("email-notifications").checked,
    };

    console.log("Settings saved:", formData);
    alert("Settings saved successfully!");
  }

  Object.keys(fields).forEach(function (key) {
    const field = fields[key];

    field.input.addEventListener("input", function () {
      handleFieldInput(key);
    });

    field.input.addEventListener("blur", function () {
      handleFieldBlur(key);
    });
  });

  themeSelect.addEventListener("change", handleThemeChange);
  form.addEventListener("submit", handleSubmit);

  updateSaveButton();
})();
