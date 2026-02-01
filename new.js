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

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const firebaseAuth = firebase.auth();
const firebaseFirestore = firebase.firestore();

/* ================= EMAILJS ================= */
 const EMAILJS_SERVICE_ID = 'service_wk8933p'; // ❌ REPLACE THIS LINE
const EMAILJS_TEMPLATE_ID = 'template_2kdaw8a';
const EMAILJS_PUBLIC_KEY = "vzI_F-zPt9FU6_Dr7";

let emailjsInitialized = false;

function initializeEmailJS() {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    emailjsInitialized = true;
    console.log('✅ EmailJS initialized');
    return true;
  } catch (error) {
    console.error('❌ EmailJS init failed:', error);
    return false;
  }
}

initializeEmailJS();

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
  console.log('DOM loaded, initializing form...');
  
  if (educationType) {
    educationType.addEventListener('change', handleEducationTypeChange);
  }
  
  if (serviceBtns.length > 0) {
    serviceBtns.forEach(btn => btn.addEventListener('click', handleServiceSelect));
  }
  
  if (otpInputs.length > 0) {
    setupOTPInputs();
  }
  
  if (otpVerifyBtn) {
    otpVerifyBtn.style.display = 'none';
    otpVerifyBtn.disabled = false;
    otpVerifyBtn.innerText = 'Verify OTP';
  }
});

/* ================= HELPER FUNCTIONS ================= */
function getEducationTypeLabel(type) {
  const labels = {
    'regular': 'Regular Course',
    'industrial': 'Industrial Training',
    'services': 'Our Service'
  };
  return labels[type] || 'Not specified';
}

/* ================= SLIDE 1 ================= */
function handleEducationTypeChange() {
  if (!regularCoursesSection || !industrialSection || !servicesSection) return;
  
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

  if (educationType.value === 'regular' && (!courseSelect || !courseSelect.value)) {
    showError('courseSelectError', 'Select a course');
    valid = false;
  }

  if (educationType.value === 'industrial') {
    if (!trainingType || !trainingType.value) {
      valid = false;
      showError('trainingTypeError','Required');
    }
    if (!trainingTech || !trainingTech.value) {
      valid = false;
      showError('trainingTechError','Required');
    }
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

  if (!name) {
    valid = false;
    showError('fullNameError','Required');
  }
  if (!/^\d{10}$/.test(mobile)) {
    valid = false;
    showError('mobileNumberError','Invalid number');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    valid = false;
    showError('emailAddressError','Invalid email');
  }

  if (!valid) return;

  Object.assign(formData, {
    name, 
    mobile, 
    email,
    address: address?.value || '',
    message: message?.value || ''
  });

  goToSlide(3);
}

/* ================= OTP INPUT ================= */
function setupOTPInputs() {
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value && index < 5) otpInputs[index + 1].focus();
      
      const filled = [...otpInputs].every(i => i.value.length === 1);
      if (filled && otpSent) {
        setTimeout(() => {
          verifyOTP();
        }, 300);
      }
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
}

/* ================= SEND OTP ================= */
async function sendOTP() {
    console.log('Sending OTP to:', formData.mobile);
    
    try {
        otpBtn.disabled = true;
        otpBtn.innerText = 'Sending OTP...';

        if (!recaptchaVerifier) {
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                'recaptcha-container',
                { size: 'normal' }
            );
            await recaptchaVerifier.render();
        }

        const phoneNumber = '+91' + formData.mobile;
        confirmationResult = await firebaseAuth.signInWithPhoneNumber(
            phoneNumber,
            recaptchaVerifier
        );

        otpSent = true;

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
        console.error('OTP sending error:', error);
        showToast('Failed to send OTP: ' + error.message, 'error');
        otpBtn.disabled = false;
        otpBtn.innerText = 'Send OTP';
    }
}

/* ================= VERIFY OTP ================= */
async function verifyOTP() {
    console.log('Verifying OTP...');

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

        // SUCCESS
        goToSlide(4);
        startRedirectCountdown();

        // Save to Firebase
        saveToFirebase()
          .then(() => console.log('✅ Data saved to Firebase'))
          .catch(err => console.error('Firebase save error:', err));
        
        // Send email
        sendEmailNotification()
          .then(() => console.log('✅ Email sent successfully'))
          .catch(err => console.error('Email sending error:', err));

    } catch (error) {
        console.error('OTP verification error:', error);
        showToast('Invalid or expired OTP. Please try again.', 'error');
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.innerText = 'Verify OTP';
        
        otpInputs.forEach(i => i.value = '');
        otpInputs[0].focus();
    }
}

/* ================= FIREBASE SAVE ================= */
async function saveToFirebase() {
  try {
    const docRef = await firebaseFirestore.collection('contactSubmissions').add({
      ...formData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      source: 'website',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Document written with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    throw error;
  }
}

/* ================= EMAIL (SIMPLE VERSION) ================= */
async function sendEmailNotification() {
  try {
    console.log('📧 Sending email notification...');
    
    // Check EmailJS
    if (!emailjsInitialized) {
      initializeEmailJS();
    }
    
    // Check if Service ID needs update
    if (EMAILJS_SERVICE_ID === 'service_epzpdfu') {
      console.error('❌ IMPORTANT: Update EMAILJS_SERVICE_ID with your actual Service ID from EmailJS dashboard');
    }
    
    // SIMPLE DATA for SIMPLE TEMPLATE
    const emailData = {
      name: formData.name || 'No Name',
      email: formData.email || 'No Email',
      phone: formData.mobile || 'No Phone',
      address: formData.address || 'Not provided',
      education_type: getEducationTypeLabel(formData.educationType),
      course: formData.course || formData.service || formData.trainingType || 'Not specified',
      technology: formData.technology || 'Not specified',
      message: formData.message || 'No message provided',
      timestamp: new Date().toLocaleString('en-IN'),
      reference_id: 'NC-' + Date.now().toString().slice(-6)
    };
    
    console.log('📧 Email data (simple):', emailData);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData
    );
    
    console.log('✅ Email sent successfully');
    showToast('Form submitted! Email sent.', 'success');
    return response;
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    if (error.text) {
      console.error('Error details:', error.text);
      
      if (error.text.includes('service ID')) {
        console.error('❌ PROBLEM: Service ID is wrong');
        console.error('Current Service ID:', EMAILJS_SERVICE_ID);
        console.error('Go to https://dashboard.emailjs.com and get your actual Service ID');
      }
    }
    
    // Still success for user
    showToast('Form submitted successfully!', 'success');
    
    return { status: 200, text: 'Form submitted' };
  }
}

/* ================= UI HELPERS ================= */
function goToSlide(n) {
  document.querySelectorAll('.form-slide').forEach(s => s.classList.remove('active'));
  const targetSlide = document.getElementById(`slide${n}`);
  if (targetSlide) {
    targetSlide.classList.add('active');
    currentSlide = n;
  }
}

function showError(id, msg) { 
  const el = document.getElementById(id);
  if (el) el.innerText = msg; 
}

function resetErrors() { 
  document.querySelectorAll('.error-message').forEach(e => e.innerText=''); 
}

function showToast(msg, type = 'success') {
  console.log(`Toast: ${type} - ${msg}`);
  
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
    `;
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = msg;
  toast.style.cssText = `
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff9800'};
    color: white;
    padding: 12px 20px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode === toastContainer) {
      toastContainer.removeChild(toast);
    }
  }, 4000);
}

function startRedirectCountdown() {
  let count = 5;
  const countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    const interval = setInterval(() => {
      countdownEl.innerText = --count;
      if (count <= 0) {
        clearInterval(interval);
        window.location.href = 'index.php';
      }
    }, 1000);
  }
}

/* ================= TEST FUNCTION ================= */
window.testEmailJS = async function() {
  try {
    console.log('🧪 Testing EmailJS with simple template...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      address: 'Test Address',
      education_type: 'Regular Course',
      course: 'Web Development',
      technology: 'MERN Stack',
      message: 'This is a test message',
      timestamp: new Date().toLocaleString(),
      reference_id: 'TEST-' + Date.now().toString().slice(-6)
    };
    
    console.log('Test data:', testData);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      testData
    );
    
    console.log('✅ Test email sent successfully!');
    showToast('✅ Test email sent! Check inbox.', 'success');
    return response;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    showToast('❌ Test failed: ' + (error.text || 'Check console'), 'error');
  }
};

// Make functions globally available
window.validateSlide1 = validateSlide1;
window.validateSlide2 = validateSlide2;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.goToSlide = goToSlide;

console.log('✅ Form script loaded successfully');


// setup done  email js  configure 