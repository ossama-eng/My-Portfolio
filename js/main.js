var CONFIG = {
  whatsappNumber: 201018840917,

  whatsappMessage: "Hi Osama, I saw your portfolio and I'd like to talk.",

  emailjs: {
    publicKey: "pvn-UQHiepNPxR8eE",
    serviceId: "service_ttlsc4s",
    templateId: "template_urh6jq8",
  },
};

var ALERT_TEXT = {
  success: {
    en: {
      title: "Message sent",
      text: "Thanks for reaching out. I will reply to you soon.",
    },
    ar: {
      title: "تم إرسال الرسالة",
      text: "شكرًا لتواصلك. هرد عليك في أقرب وقت.",
    },
  },
  error: {
    en: {
      title: "Message not sent",
      text: "Something went wrong on the way. Send it to me on WhatsApp instead.",
    },
    ar: {
      title: "الرسالة لم تُرسَل",
      text: "حصلت مشكلة أثناء الإرسال. ابعتهالي على واتساب احسن.",
    },
  },
};

var body = document.body;
var htmlEl = document.documentElement;
var themeToggle = document.getElementById("themeToggle");
var langToggle = document.getElementById("langToggle");
var langLabel = document.getElementById("langLabel");
var burger = document.getElementById("burger");
var navLinks = document.getElementById("navLinks");
var contactForm = document.getElementById("contactForm");
var submitBtn = document.getElementById("submitBtn");

var alertOverlay = document.getElementById("alertOverlay");
var alertTitle = document.getElementById("alertTitle");
var alertText = document.getElementById("alertText");
var alertClose = document.getElementById("alertClose");
var alertWhatsapp = document.getElementById("alertWhatsapp");
var markSuccess = document.getElementById("markSuccess");
var markError = document.getElementById("markError");

var currentLang = "en";

(function buildWhatsappLinks() {
  var url =
    "https://wa.me/" +
    CONFIG.whatsappNumber +
    "?text=" +
    encodeURIComponent(CONFIG.whatsappMessage);

  var link = document.getElementById("whatsappLink");
  if (link) link.setAttribute("href", url);
  if (alertWhatsapp) alertWhatsapp.setAttribute("href", url);
})();

(function initTheme() {
  var saved = null;
  try {
    saved = localStorage.getItem("om-theme");
  } catch (e) {}

  if (
    !saved &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    saved = "light";
  }

  applyTheme(saved === "light" ? "light" : "dark");
})();

function applyTheme(mode) {
  if (mode === "light") {
    body.classList.add("theme-light");
    body.classList.remove("theme-dark");
  } else {
    body.classList.add("theme-dark");
    body.classList.remove("theme-light");
  }
  try {
    localStorage.setItem("om-theme", mode);
  } catch (e) {}
}

themeToggle.addEventListener("click", function () {
  applyTheme(body.classList.contains("theme-light") ? "dark" : "light");
});

(function initLang() {
  var saved = null;
  try {
    saved = localStorage.getItem("om-lang");
  } catch (e) {}
  applyLang(saved === "ar" ? "ar" : "en");
})();

function applyLang(lang) {
  currentLang = lang;

  var nodes = document.querySelectorAll("[data-en]");
  for (var i = 0; i < nodes.length; i++) {
    var value = nodes[i].getAttribute("data-" + lang);
    if (value !== null) nodes[i].textContent = value;
  }

  htmlEl.setAttribute("lang", lang);
  htmlEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  langLabel.textContent = lang === "ar" ? "EN" : "AR";
  langToggle.setAttribute(
    "aria-label",
    lang === "ar" ? "Switch to English" : "التحويل إلى العربية",
  );

  try {
    localStorage.setItem("om-lang", lang);
  } catch (e) {}
}

langToggle.addEventListener("click", function () {
  applyLang(currentLang === "ar" ? "en" : "ar");
});

burger.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  burger.classList.toggle("open");
});

navLinks.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
  }
});

(function initReveal() {
  var items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add("visible");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      var order = 0;

      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.style.transitionDelay = order * 90 + "ms";
        entry.target.classList.add("visible");
        order++;

        fillBarsInside(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  for (var j = 0; j < items.length; j++) observer.observe(items[j]);
})();

function fillBarsInside(element) {
  var fills = element.querySelectorAll(".bar-fill");
  for (var i = 0; i < fills.length; i++) {
    (function (fill) {
      setTimeout(function () {
        fill.style.width = fill.getAttribute("data-level") + "%";
      }, 220);
    })(fills[i]);
  }
}

(function initActiveLink() {
  var sections = document.querySelectorAll("section[id]");
  var links = navLinks.querySelectorAll("a");

  window.addEventListener(
    "scroll",
    function () {
      var position = window.scrollY + 140;
      var currentId = "";

      for (var i = 0; i < sections.length; i++) {
        if (position >= sections[i].offsetTop)
          currentId = sections[i].getAttribute("id");
      }

      for (var j = 0; j < links.length; j++) {
        var href = links[j].getAttribute("href").replace("#", "");
        if (href === currentId) links[j].classList.add("active");
        else links[j].classList.remove("active");
      }
    },
    { passive: true },
  );
})();

function showAlert(type) {
  var content = ALERT_TEXT[type][currentLang];

  alertTitle.textContent = content.title;
  alertText.textContent = content.text;

  markSuccess.classList.remove("show");
  markError.classList.remove("show");
  alertWhatsapp.classList.remove("show");

  void markSuccess.offsetWidth;
  void markError.offsetWidth;

  if (type === "success") {
    markSuccess.classList.add("show");
  } else {
    markError.classList.add("show");
    alertWhatsapp.classList.add("show");
  }

  alertOverlay.classList.add("open");
  alertOverlay.setAttribute("aria-hidden", "false");
  alertClose.focus();
}

function hideAlert() {
  alertOverlay.classList.remove("open");
  alertOverlay.setAttribute("aria-hidden", "true");
  markSuccess.classList.remove("show");
  markError.classList.remove("show");
}

alertClose.addEventListener("click", hideAlert);

alertOverlay.addEventListener("click", function (e) {
  if (e.target === alertOverlay) hideAlert();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && alertOverlay.classList.contains("open"))
    hideAlert();
});

if (CONFIG.emailjs.publicKey !== "YOUR_PUBLIC_KEY" && window.emailjs) {
  emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  var original = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    "<span>" +
    (currentLang === "ar" ? "جارٍ الإرسال…" : "Sending…") +
    "</span>";

  var params = {
    from_name: document.getElementById("name").value.trim(),
    from_email: document.getElementById("email").value.trim(),
    subject:
      document.getElementById("subject").value.trim() || "Portfolio message",
    message: document.getElementById("message").value.trim(),
  };

  var notConfigured =
    !window.emailjs ||
    CONFIG.emailjs.publicKey === "YOUR_PUBLIC_KEY" ||
    CONFIG.emailjs.serviceId === "YOUR_SERVICE_ID" ||
    CONFIG.emailjs.templateId === "YOUR_TEMPLATE_ID";

  if (notConfigured) {
    console.warn(
      "EmailJS is not configured yet — fill CONFIG.emailjs in js/main.js",
    );
    restoreButton(original);
    showAlert("error");
    return;
  }

  emailjs
    .send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, params)
    .then(function () {
      restoreButton(original);
      contactForm.reset();
      showAlert("success");
    })
    .catch(function (err) {
      console.error(err);
      restoreButton(original);
      showAlert("error");
    });
});

function restoreButton(html) {
  submitBtn.disabled = false;
  submitBtn.innerHTML = html;
}

function validateForm() {
  var ok = true;

  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var message = document.getElementById("message");

  ok = setFieldState(name, name.value.trim().length > 1) && ok;
  ok =
    setFieldState(
      email,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
    ) && ok;
  ok = setFieldState(message, message.value.trim().length > 4) && ok;

  return ok;
}

function setFieldState(input, isValid) {
  var field = input.closest(".field");
  if (isValid) field.classList.remove("invalid");
  else field.classList.add("invalid");
  return isValid;
}

/* clear the error as soon as the person starts fixing it */
var inputs = contactForm.querySelectorAll("input, textarea");
for (var k = 0; k < inputs.length; k++) {
  inputs[k].addEventListener("input", function () {
    this.closest(".field").classList.remove("invalid");
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
