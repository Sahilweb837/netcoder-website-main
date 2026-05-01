
function openBox() {
  document.querySelector(".book-demo").style.display = "block";
}
function closeForm() {
  document.querySelector(".book-demo").style.display = "none";
}
document.querySelector(".background").style.display = "none";

document.addEventListener("DOMContentLoaded", function () {

  /* ================== GLOBAL ================== */
  const selectDom = document.querySelector(".demo-courses");
  const verify_war = document.querySelector(".verify_war");
  const otpBox = document.querySelector(".background");
  
  /* ================== DYNAMICALLY INJECT SUCCESS MODAL IF MISSING ================== */
  if (!document.getElementById("successModal") && document.querySelector(".book-demo")) {
      const modalHTML = `
<style>
@keyframes successFadeIn { from{opacity:0} to{opacity:1} }
@keyframes successCardPop { 0%{opacity:0;transform:scale(.7) translateY(40px)} 60%{transform:scale(1.03) translateY(-5px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
@keyframes checkBounce { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.3)} 70%{transform:scale(.9)} 100%{transform:scale(1);opacity:1} }
@keyframes checkRing { 0%{box-shadow:0 0 0 0 rgba(76,175,80,.5)} 70%{box-shadow:0 0 0 20px rgba(76,175,80,0)} 100%{box-shadow:0 0 0 0 rgba(76,175,80,0)} }
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes confettiFall { 0%{transform:translateY(-10px) rotate(0);opacity:1} 100%{transform:translateY(350px) rotate(720deg);opacity:0} }
.success-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);z-index:99999;align-items:center;justify-content:center;animation:successFadeIn .3s ease}
.success-card{background:#fff;border-radius:20px;padding:40px 35px 35px;max-width:440px;width:90%;text-align:center;position:relative;overflow:hidden;animation:successCardPop .6s cubic-bezier(.34,1.56,.64,1) forwards;box-shadow:0 25px 80px rgba(0,0,0,.25)}
.success-card .accent-bar{position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF5532,#ff7a5c,#4CAF50,#66BB6A);background-size:200% 100%;animation:shimmer 3s linear infinite}
.success-card .check-circle{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#4CAF50,#66BB6A);margin:0 auto 18px;display:flex;align-items:center;justify-content:center;animation:checkBounce .7s .3s cubic-bezier(.34,1.56,.64,1) both,checkRing 1.5s .8s ease both}
.success-card .check-circle span{font-size:44px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.15)}
.success-card h3{font-size:24px;font-weight:700;color:#1a1a1a;margin:0 0 6px;animation:slideUp .5s .5s ease both}
.success-card .user-greeting{font-size:15px;color:#666;line-height:1.7;margin:8px 0 0;animation:slideUp .5s .6s ease both}
.success-card .user-greeting strong{color:#FF5532;font-size:17px}
.success-card .info-card{background:linear-gradient(135deg,#f8f9fa,#fff);border-radius:14px;padding:18px 20px;margin:22px 0;border:1px solid #eee;text-align:left;animation:slideUp .5s .7s ease both}
.success-card .info-row{display:flex;align-items:center;gap:10px;padding:6px 0}
.success-card .info-row:not(:last-child){border-bottom:1px solid #f0f0f0;padding-bottom:10px;margin-bottom:4px}
.success-card .info-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.success-card .info-label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.5px}
.success-card .info-value{font-size:14px;font-weight:600;color:#333}
.success-card .team-note{font-size:12px;color:#bbb;margin-bottom:20px;animation:slideUp .5s .8s ease both}
.success-card .ok-btn{display:inline-block;padding:13px 55px;border-radius:10px;font-size:15px;font-weight:700;background:linear-gradient(135deg,#FF5532,#ff7a5c);border:none;color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(255,85,50,.35);transition:transform .2s,box-shadow .2s;animation:slideUp .5s .9s ease both;letter-spacing:.5px}
.success-card .ok-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,85,50,.45)}
.success-card .close-x{position:absolute;top:14px;right:18px;font-size:22px;font-weight:bold;cursor:pointer;color:#ccc;transition:color .2s;z-index:2}
.success-card .close-x:hover{color:#FF5532}
.confetti{position:absolute;width:8px;height:8px;top:-10px;border-radius:2px;animation:confettiFall 2.5s ease-in forwards}
</style>

<div class="success-overlay" id="successModal">
    <div class="success-card">
        <div class="accent-bar"></div>
        <span class="close-x" id="closeSuccessBtn">&times;</span>
        <div id="confettiContainer"></div>
        <div class="check-circle"><span>&#10004;</span></div>
        <h3>Booking Confirmed!</h3>
        <p class="user-greeting">Thank you <strong id="successUserName"></strong>!<br>Your information was successfully received by <strong>Netcoder Technology</strong>.</p>
        <div class="info-card">
            <div class="info-row">
                <div class="info-icon" style="background:#fff3e0;">&#9200;</div>
                <div><div class="info-label">Slot</div><div class="info-value" id="successSlotText"></div></div>
            </div>
            <div class="info-row">
                <div class="info-icon" style="background:#e8f5e9;">&#128197;</div>
                <div><div class="info-label">Date</div><div class="info-value" id="successDateText"></div></div>
            </div>
            <div class="info-row">
                <div class="info-icon" style="background:#e3f2fd;">&#128222;</div>
                <div><div class="info-label">What's Next</div><div class="info-value" style="font-weight:500;color:#666;">Our team will call you shortly</div></div>
            </div>
        </div>
        <p class="team-note">Please keep your phone nearby.</p>
        <button class="ok-btn" id="successOkBtn">Awesome!</button>
    </div>
</div>`;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const otpbutton = document.querySelector(".otp-btn-verify");
  const inputs = document.querySelectorAll(".otpNumber input");
  const errorMsgBody = document.querySelector(".error-msg-span");
  const otpPara = document.querySelector(".otpPara");
  const closeOtpBtn = document.getElementById("closeOtpBtn");

  if(closeOtpBtn) {
    closeOtpBtn.addEventListener("click", () => {
      otpBox.style.display = "none";
    });
  }

  let coderesult = null;
  let userInputOtp = "";
  let slot = "Morning";

  window.shiftSlot = function(selectedSlot) {
    const morningBtn = document.getElementById("morningBtn");
    const eveningBtn = document.getElementById("eveningBtn");

    // Block Morning selection if the button is disabled
    if (selectedSlot === "Morning" && morningBtn && morningBtn.disabled) {
      return; // Do nothing
    }

    slot = selectedSlot;
    if(morningBtn && eveningBtn) {
      if(selectedSlot === "Morning") {
        morningBtn.style.background = "#FF5532";
        morningBtn.style.color = "white";
        eveningBtn.style.background = "transparent";
        eveningBtn.style.color = "black";
        eveningBtn.style.border = "1px solid #ddd";
      } else {
        eveningBtn.style.background = "#FF5532";
        eveningBtn.style.color = "white";
        morningBtn.style.background = "transparent";
        morningBtn.style.color = "black";
        morningBtn.style.border = "1px solid #ddd";
      }
    }
  };

  // Initialize styling on load
  shiftSlot("Morning");

  /* ================== DATE VALIDATION (MORNING SLOT) ================== */
  const dateInput = document.querySelector(".book-demo #date");
  const slotWarning = document.getElementById("slotWarning");
  
  if (dateInput) {
    const todayStr = new Date().toISOString().split("T")[0];
    // Set minimum date and default to today
    dateInput.setAttribute("min", todayStr);
    dateInput.value = todayStr;

    function validateSlotTime() {
      const selectedDate = dateInput.value || todayStr;
      const currentHour = new Date().getHours();
      const morningBtn = document.getElementById("morningBtn");

      if (selectedDate === todayStr && currentHour >= 12) {
        // Disable Morning slot
        if (morningBtn) {
          morningBtn.disabled = true;
          morningBtn.style.opacity = "0.4";
          morningBtn.style.cursor = "not-allowed";
          morningBtn.style.background = "#ccc";
          morningBtn.style.color = "#999";
          morningBtn.style.border = "1px solid #ccc";
        }
        if (slotWarning) slotWarning.style.display = "block";
        
        // Auto-switch to Evening
        slot = "Evening";
        shiftSlot("Evening");
      } else {
        // Enable Morning slot
        if (morningBtn) {
          morningBtn.disabled = false;
          morningBtn.style.opacity = "1";
          morningBtn.style.cursor = "pointer";
        }
        if (slotWarning) slotWarning.style.display = "none";
      }
    }

    dateInput.addEventListener("change", validateSlotTime);
    // Run immediately on load
    validateSlotTime();
  }

  /* ================== FETCH COURSES ================== */
  const allCourses = document.querySelectorAll(".mega-box .mega-col a");

  if (selectDom && allCourses.length) {
    const courses = Array.from(allCourses).map(c => c.textContent.trim());

    selectDom.innerHTML = '<option value="">Select Course</option>';

    courses.forEach(course => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      selectDom.appendChild(option);
    });
  }

  /* ================== OTP INPUT HANDLING ================== */
  inputs.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
      const next = input.nextElementSibling;
      const prev = input.previousElementSibling;

      if (input.value.length > 1) input.value = "";

      if (next && input.value !== "") {
        next.removeAttribute("disabled");
        next.focus();
      }

      if (e.key === "Backspace" && prev) {
        input.value = "";
        prev.focus();
      }

      // Enable verify button
      if ([...inputs].every(i => i.value !== "")) {
        otpbutton.classList.add("active");
      } else {
        otpbutton.classList.remove("active");
      }
    });
  });

  /* ================== VALIDATION ================== */
  function validateForm() {
    const name = document.querySelector(".book-demo #name") ? document.querySelector(".book-demo #name").value.trim() : "";
    const email = document.querySelector(".book-demo #email") ? document.querySelector(".book-demo #email").value.trim() : "";
    const number = document.querySelector(".book-demo #number") ? document.querySelector(".book-demo #number").value.trim() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const nameRegex = /^[a-zA-Z\s]{3,}$/;

    if (!nameRegex.test(name)) {
      verify_war.innerHTML = "Enter valid name";
      return false;
    }

    if (!emailRegex.test(email)) {
      verify_war.innerHTML = "Enter valid email";
      return false;
    }

    if (!phoneRegex.test(number)) {
      verify_war.innerHTML = "Enter valid mobile number";
      return false;
    }

    return true;
  }

  window.verify = function() {
    // Prevent form submission if event exists
    if (window.event) {
        window.event.preventDefault();
    }
    
    if (validateForm()) {
        verifyOtp();
    }
  };

  /* ================== FIREBASE INIT ================== */
  const firebaseConfig = {
    apiKey: "AIzaSyBGHd5l5nLwqsK3tqZwZrfFkrsvQyxW6rk",
    authDomain: "demoform-netcoder-website.firebaseapp.com",
    projectId: "demoform-netcoder-website",
    storageBucket: "demoform-netcoder-website.firebasestorage.app",
    messagingSenderId: "755574278305",
    appId: "1:755574278305:web:d44565fdf35cc62202c8e0",
    measurementId: "G-BWFCRTJWQG"
  };

  firebase.initializeApp(firebaseConfig);

  /* ================== OTP SEND ================== */
  function sendOTP() {
    const numberEl = document.querySelector(".book-demo #number");
    const number = "+91" + (numberEl ? numberEl.value.trim() : "");

    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier)
      .then(res => {
        coderesult = res;
        console.log("OTP SENT");
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
      });
  }

  /* ================== VERIFY BUTTON ================== */
 function verifyOtp() {
  verify_war.innerHTML = "";

  document.querySelector(".book-demo").style.display = "none";
  otpBox.style.display = "block";

  // Create ONLY ONCE
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible"
      }
    );

    recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }

  sendOTP();
}

  /* ================== OTP VERIFY ================== */
  otpbutton.addEventListener("click", (e) => {
    e.preventDefault();

    userInputOtp = [...inputs].map(i => i.value).join("");

    if (userInputOtp.length !== 6) {
      errorMsgBody.innerHTML = "Enter 6-digit OTP";
      return;
    }

    coderesult.confirm(userInputOtp)
      .then(() => {
        errorMsgBody.innerHTML = "Verified Successfully";

        setTimeout(() => {
          otpBox.style.display = "none";
          submitForm();
        }, 1500);
      })
      .catch(() => {
        errorMsgBody.innerHTML = "Invalid OTP";
        otpPara.innerHTML = "Try again";
      });
  });

  /* ================== FINAL SUBMIT ================== */
  function submitForm() {
    const name = document.querySelector(".book-demo #name") ? document.querySelector(".book-demo #name").value : "";
    const email = document.querySelector(".book-demo #email") ? document.querySelector(".book-demo #email").value : "";
    const phone = document.querySelector(".book-demo #number") ? document.querySelector(".book-demo #number").value : "";
    const course = document.querySelector(".book-demo .demo-courses") ? document.querySelector(".book-demo .demo-courses").value : "";
    const address = document.querySelector(".book-demo #address") ? document.querySelector(".book-demo #address").value : "";
    const date = new Date().toLocaleDateString();

    emailjs.send("service_fall03r", "template_lvuwe08", {
      name: name,
      email: email,
      phone: phone,
      address: address,
      course: course,
      date: date,
      slot: slot
    }).then(function(response) {
       console.log('Email sent successfully!', response.status, response.text);
    }, function(error) {
       console.error('Email failed to send...', error);
    });

    const successModal = document.getElementById("successModal");
    const successSlotText = document.getElementById("successSlotText");
    const successDateText = document.getElementById("successDateText");
    const successUserName = document.getElementById("successUserName");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    const successOkBtn = document.getElementById("successOkBtn");
    const confettiContainer = document.getElementById("confettiContainer");

    if (successUserName) {
        successUserName.innerText = name || "Student";
    }

    if (slot === "Morning") {
        successSlotText.innerText = "Morning Slot (Before 12 PM)";
    } else {
        successSlotText.innerText = "Evening Slot";
    }

    // Show the selected date
    const selectedDateVal = document.querySelector(".book-demo #date") ? document.querySelector(".book-demo #date").value : "";
    if (successDateText) {
        const d = selectedDateVal ? new Date(selectedDateVal) : new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        successDateText.innerText = d.toLocaleDateString('en-IN', options);
    }

    // Generate confetti
    if (confettiContainer) {
        confettiContainer.innerHTML = "";
        const colors = ["#FF5532", "#4CAF50", "#FFD700", "#2196F3", "#FF9800", "#9C27B0", "#00BCD4"];
        for (let i = 0; i < 30; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = (Math.random() * 1.5) + "s";
            piece.style.animationDuration = (2 + Math.random() * 2) + "s";
            piece.style.width = (5 + Math.random() * 6) + "px";
            piece.style.height = (5 + Math.random() * 6) + "px";
            confettiContainer.appendChild(piece);
        }
    }

    if(successModal) {
        successModal.style.display = "flex";
    }

    function closeSuccessModal() {
        if(successModal) {
            successModal.style.display = "none";
            window.location.reload();
        }
    }

    if(closeSuccessBtn) closeSuccessBtn.onclick = closeSuccessModal;
    if(successOkBtn) successOkBtn.onclick = closeSuccessModal;
  }

});