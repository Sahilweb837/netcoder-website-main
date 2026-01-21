 if (window.__OTP_FORM_LOADED__) {
  console.warn('Script already loaded, skipping re-init');
} else {
  window.__OTP_FORM_LOADED__ = true;
}
/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyA8sJcCZgr-s560FDQqJf2PZygw7UfikiY",
  authDomain: "otp-for-netcoder-website.firebaseapp.com",
  projectId: "otp-for-netcoder-website",
  storageBucket: "otp-for-netcoder-website.firebasestorage.app",
  messagingSenderId: "986300499230",
  appId: "1:986300499230:web:57c01bce30fe09c5f6350f",
  measurementId: "G-X4NBHP5WSR"
};

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
const firebaseFirestore = firebase.firestore();

/* ================= EMAILJS ================= */
emailjs.init("arbtZPAg8iH0kJRCt");

/* ================= GLOBAL STATE ================= */
let currentSlide = 1;
let selectedService = null;
let confirmationResult = null;
let recaptchaVerifier = null;
let otpSent = false;
let formData = {};

/* ================= DOM ================= */
const educationType = document.getElementById('educationType');
const regularCoursesSection = document.getElementById('regularCoursesSection');
const industrialSection = document.getElementById('industrialSection');
const servicesSection = document.getElementById('servicesSection');
const serviceBtns = document.querySelectorAll('.service-btn');
const otpInputs = document.querySelectorAll('.otp-input');
const otpBtn = document.querySelector('.otp-btn');
const otpVerifyBtn = document.querySelector('.otp-btn-verify');

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  educationType.addEventListener('change', handleEducationTypeChange);
  serviceBtns.forEach(btn => btn.addEventListener('click', handleServiceSelect));
  setupOTPInputs();
  
  // Initialize OTP verify button as hidden
  otpVerifyBtn.style.display = 'none';
  otpVerifyBtn.disabled = false;
  otpVerifyBtn.innerText = 'Verify OTP';
});

/* ================= SLIDE 1 ================= */
function handleEducationTypeChange() {
  regularCoursesSection.style.display = 'none';
  industrialSection.style.display = 'none';
  servicesSection.style.display = 'none';
  resetErrors();

  if (educationType.value === 'regular') regularCoursesSection.style.display = 'block';
  if (educationType.value === 'industrial') industrialSection.style.display = 'block';
  if (educationType.value === 'services') servicesSection.style.display = 'block';
}

function handleServiceSelect(e) {
  serviceBtns.forEach(b => b.classList.remove('selected'));
  e.target.classList.add('selected');
  selectedService = e.target.dataset.service;
}

function validateSlide1() {
  resetErrors();
  let valid = true;

  if (!educationType.value) {
    showError('educationTypeError', 'Please select an option');
    valid = false;
  }

  if (educationType.value === 'regular' && !courseSelect.value) {
    showError('courseSelectError', 'Select a course');
    valid = false;
  }

  if (educationType.value === 'industrial') {
    if (!trainingType.value) valid = false, showError('trainingTypeError','Required');
    if (!trainingTech.value) valid = false, showError('trainingTechError','Required');
  }

  if (educationType.value === 'services' && !selectedService) {
    showError('serviceError', 'Select a service');
    valid = false;
  }

  if (!valid) return;

  formData = {
    educationType: educationType.value,
    course: courseSelect?.value || '',
    trainingType: trainingType?.value || '',
    technology: trainingTech?.value || '',
    service: selectedService || ''
  };

  goToSlide(2);
}

/* ================= SLIDE 2 ================= */
function validateSlide2() {
  resetErrors();
  let valid = true;

  const name = fullName.value.trim();
  const mobile = mobileNumber.value.trim();
  const email = emailAddress.value.trim();

  if (!name) valid = false, showError('fullNameError','Required');
  if (!/^\d{10}$/.test(mobile)) valid = false, showError('mobileNumberError','Invalid number');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) valid = false, showError('emailAddressError','Invalid email');

  if (!valid) return;

  Object.assign(formData, {
    name, mobile, email,
    address: address.value,
    message: message.value
  });

  goToSlide(3);
}

/* ================= OTP INPUT ================= */
function setupOTPInputs() {
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value && index < 5) otpInputs[index + 1].focus();
      
      // Auto-verify when all inputs are filled
      const filled = [...otpInputs].every(i => i.value.length === 1);
      if (filled && otpSent) {
        // Auto-verify after a short delay
        setTimeout(() => {
          verifyOTP();
        }, 300);
      }
    });
    
    // Handle backspace for better UX
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
}

/* ================= SEND OTP ================= */
async function sendOTP() {
    try {
        otpBtn.disabled = true;
        otpBtn.innerText = 'Sending OTP...';

        // CREATE reCAPTCHA ONLY ONCE
        if (!recaptchaVerifier) {
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                'recaptcha-container',
                { size: 'normal' }
            );
            await recaptchaVerifier.render();
        }

        confirmationResult = await firebaseAuth.signInWithPhoneNumber(
            '+91' + formData.mobile,
            recaptchaVerifier
        );

        otpSent = true;

        // Hide send button and show verify button
        otpBtn.style.display = 'none';
        otpVerifyBtn.style.display = 'block';
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.innerText = 'Verify OTP';

        otpInputs.forEach(i => {
            i.disabled = false;
            i.value = '';
        });

        otpInputs[0].focus();

        showToast('OTP sent successfully', 'success');

    } catch (error) {
        console.error(error);
        otpBtn.disabled = false;
        otpBtn.innerText = 'Send OTP';
        showToast('Failed to send OTP. Try again.', 'error');
    }
}

/* ================= VERIFY OTP ================= */
async function verifyOTP() {
    console.log('Verify OTP clicked');

    if (!confirmationResult) {
        alert('Please click Send OTP first');
        return;
    }

    const otp = Array.from(otpInputs).map(i => i.value).join('');

    if (otp.length !== 6) {
        alert('Please enter 6 digit OTP');
        return;
    }

    try {
        otpVerifyBtn.disabled = true;
        otpVerifyBtn.innerText = 'Verifying...';

        await confirmationResult.confirm(otp);

        console.log('OTP VERIFIED SUCCESSFULLY');

        // SUCCESS
        goToSlide(4);
        startRedirectCountdown();

        // NON BLOCKING
        saveToFirebase().catch(()=>{});
        sendEmailNotification().catch(()=>{});

    } catch (error) {
        console.error(error);
        alert('Invalid or expired OTP');
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.innerText = 'Verify OTP';
        
        // Clear OTP inputs on error
        otpInputs.forEach(i => i.value = '');
        otpInputs[0].focus();
    }
}

/* ================= FIREBASE SAVE ================= */
async function saveToFirebase() {
  await firebaseFirestore.collection('contactSubmissions').add({
    ...formData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    source: 'website'
  });
}

/* ================= EMAIL ================= */
async function sendEmailNotification() {
  return emailjs.send(
    'service_xukw6z4',
    'template_ny7v7la',
    {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.mobile,
      course: formData.course || formData.service || formData.trainingType,
      message: formData.message || 'No message'
    }
  );
}

/* ================= UI HELPERS ================= */
function goToSlide(n) {
  document.querySelectorAll('.form-slide').forEach(s => s.classList.remove('active'));
  document.getElementById(`slide${n}`).classList.add('active');
}

function showError(id,msg){ 
  const el = document.getElementById(id);
  if (el) el.innerText = msg; 
}

function resetErrors(){ 
  document.querySelectorAll('.error-message').forEach(e => e.innerText=''); 
}

function showToast(msg,type='success'){
  const toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) return;
  
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerText=msg;
  toastContainer.appendChild(t);
  setTimeout(()=>t.remove(),4000);
}

function startRedirectCountdown(){
  let c=5;
  const el=document.querySelector('.countdown');
  if (!el) return;
  
  const i=setInterval(()=>{
    el.innerText=--c;
    if(c<=0){clearInterval(i);location.href='index.php';}
  },1000);
}