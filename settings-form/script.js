const STORAGE_KEY = "settings-form-data";

const DEFAULT_SETTINGS = {
  displayName: "",
  email: "",
  username: "",
  theme: "system",
  language: "en",
  timezone: "UTC",
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  profileVisibility: "public",
  sessionTimeout: "60",
  twoFactor: false,
};

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("form-status");
const resetBtn = document.getElementById("reset-btn");

const validators = {
  displayName(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Display name is required.";
    if (trimmed.length < 2) return "Display name must be at least 2 characters.";
    return "";
  },

  email(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) return "Enter a valid email address.";
    return "";
  },

  username(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Username is required.";
    if (trimmed.length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return "Username can only contain letters, numbers, and underscores.";
    }
    return "";
  },
};

function getFormData() {
  return {
    displayName: form.displayName.value.trim(),
    email: form.email.value.trim(),
    username: form.username.value.trim(),
    theme: form.theme.value,
    language: form.language.value,
    timezone: form.timezone.value,
    emailNotifications: form.emailNotifications.checked,
    pushNotifications: form.pushNotifications.checked,
    marketingEmails: form.marketingEmails.checked,
    profileVisibility: form.profileVisibility.value,
    sessionTimeout: form.sessionTimeout.value,
    twoFactor: form.twoFactor.checked,
  };
}

function populateForm(data) {
  form.displayName.value = data.displayName;
  form.email.value = data.email;
  form.username.value = data.username;
  form.theme.value = data.theme;
  form.language.value = data.language;
  form.timezone.value = data.timezone;
  form.emailNotifications.checked = data.emailNotifications;
  form.pushNotifications.checked = data.pushNotifications;
  form.marketingEmails.checked = data.marketingEmails;
  form.profileVisibility.value = data.profileVisibility;
  form.sessionTimeout.value = data.sessionTimeout;
  form.twoFactor.checked = data.twoFactor;
}

function showFieldError(fieldName, message) {
  const input = form[fieldName];
  const errorEl = document.getElementById(`${fieldName}-error`);

  if (message) {
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
  } else {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }
}

function clearAllErrors() {
  Object.keys(validators).forEach((field) => showFieldError(field, ""));
}

function validateField(fieldName) {
  const error = validators[fieldName](form[fieldName].value);
  showFieldError(fieldName, error);
  return !error;
}

function validateForm() {
  clearAllErrors();
  const results = Object.keys(validators).map(validateField);
  return results.every(Boolean);
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

function saveSettings(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    showStatus("Please fix the errors before saving.", "error");
    return;
  }

  const data = getFormData();
  saveSettings(data);
  showStatus("Settings saved successfully.", "success");
}

function handleReset() {
  populateForm(DEFAULT_SETTINGS);
  clearAllErrors();
  localStorage.removeItem(STORAGE_KEY);
  showStatus("Settings reset to defaults.", "success");
}

function init() {
  populateForm(loadSettings());

  form.addEventListener("submit", handleSubmit);
  resetBtn.addEventListener("click", handleReset);

  Object.keys(validators).forEach((fieldName) => {
    form[fieldName].addEventListener("blur", () => validateField(fieldName));
    form[fieldName].addEventListener("input", () => {
      if (form[fieldName].classList.contains("invalid")) {
        validateField(fieldName);
      }
    });
  });
}

init();
