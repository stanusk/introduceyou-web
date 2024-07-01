document.addEventListener("DOMContentLoaded", () => {
  // Consent banner functionality
  const consentBanner = document.getElementById("consent-banner");
  const acceptButton = document.getElementById("accept-consent");
  const rejectButton = document.getElementById("reject-consent");

  function showConsentBanner() {
    consentBanner.style.display = "flex";
  }

  function hideConsentBanner() {
    consentBanner.style.display = "none";
  }

  function setConsent(granted) {
    localStorage.setItem("consentGranted", granted);
    hideConsentBanner();

    if (granted) {
      gtag("consent", "update", {
        ad_user_data: "granted",
        ad_personalization: "granted",
        ad_storage: "granted",
        analytics_storage: "granted",
      });

      // Load Google Analytics
      var gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src =
        "https://www.googletagmanager.com/gtag/js?id=G-2QERCTMWCD";
      document.head.appendChild(gtagScript);
    }
  }

  acceptButton.addEventListener("click", () => setConsent(true));
  rejectButton.addEventListener("click", () => setConsent(false));

  // Check if consent has been given before
  const consentGranted = localStorage.getItem("consentGranted");
  if (consentGranted === null) {
    showConsentBanner();
  } else if (consentGranted === "true") {
    setConsent(true);
  }

  // Q&A functionality
  const qaItems = document.querySelectorAll(".qa-item");

  qaItems.forEach((item) => {
    const header = item.querySelector("h3");
    header.addEventListener("click", () => {
      item.classList.toggle("active");
      if (item.classList.contains("active")) {
        gtag("event", "qa_expanded", {
          event_category: "engagement",
          event_label: header.textContent,
        });
      }
    });
  });

  // Privacy popup functionality
  const termsPrivacy = document.getElementById("terms-privacy");
  const privacyPopup = document.getElementById("privacy-popup");
  const closePopup = document.getElementById("close-popup");

  termsPrivacy.addEventListener("click", () => {
    privacyPopup.style.display = "flex";
    gtag("event", "privacy_policy_view", {
      event_category: "engagement",
      event_label: "privacy_policy",
    });
  });

  closePopup.addEventListener("click", () => {
    privacyPopup.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === privacyPopup) {
      privacyPopup.style.display = "none";
    }
  });

  // Waitlist popup functionality
  const joinWaitlistButtons = document.querySelectorAll(".join-waitlist");
  const waitlistPopup = document.getElementById("waitlist-popup");
  const closeWaitlistPopup = document.getElementById("close-waitlist-popup");
  const waitlistForm = document.getElementById("waitlist-form");

  joinWaitlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      waitlistPopup.style.display = "flex";
    });
  });

  closeWaitlistPopup.addEventListener("click", () => {
    waitlistPopup.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === waitlistPopup) {
      waitlistPopup.style.display = "none";
    }
  });

  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form data
    const firstName = document.getElementById("first-name").value;
    const email = document.getElementById("email").value;
    const nextEvent = document.getElementById("next-event").value;
    const whoToMeet = document.getElementById("who-to-meet").value;

    // Prepare data for Airtable
    const data = {
      records: [
        {
          fields: {
            "first-name": firstName,
            email: email,
            "next-event": nextEvent,
            "who-to-meet": whoToMeet,
          },
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.airtable.com/v0/app1Ul7bP0f43pWO9/tbl2F7s71ltvcJ0tA",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer pat4T9bCu8kbbBYIs.d4ffb06e9c41e7342df2ec3c907a25b8fc52fe7d7f9d2e75a939f7267ce3f32a",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        waitlistPopup.style.display = "none";
        alert("Thank you for joining our waitlist!");
        // Track successful waitlist submission
        gtag("event", "waitlist_submission", {
          event_category: "engagement",
          event_label: "waitlist",
        });
      } else {
        throw new Error("Failed to submit!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was an error submitting your information. Please try again later."
      );
    }
  });
});
