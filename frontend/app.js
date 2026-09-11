const BASE_URL = 'http://localhost:5000/auth'; // عدّل البورت حسب السيرفر عندك



// التنقل بين الشاشات
function switchTab(tabName) {
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => form.classList.add('hidden'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(`${tabName}-form`).classList.remove('hidden');
  event.target.classList.add('active');
  
  hideAlert();
}

// عرض التنبيهات
function showAlert(message, type = 'error') {
  const alertDiv = document.getElementById('alert');
  alertDiv.className = `alert ${type}`;
  alertDiv.innerText = Array.isArray(message) ? message.join(' | ') : message;
  alertDiv.classList.remove('hidden');
}

function hideAlert() {
  document.getElementById('alert').classList.add('hidden');
}

// دالة إرسال الطلبات للباك إند
async function sendRequest(endpoint, data) {
  hideAlert();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.errors || result.message || 'حدث خطأ في الاتصال';
      showAlert(errorMsg, 'error');
      return null;
    }

    showAlert(result.message || 'تمت العملية بنجاح!', 'success');
    return result;
  } catch (err) {
    showAlert('تعذر الاتصال بالسيرفر، تأكد أن الباك إند يعمل', 'error');
    return null;
  }
}

// 1. Register Form Handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById('reg-username').value,
    email: document.getElementById('reg-email').value,
    password: document.getElementById('reg-password').value,
    phone: document.getElementById('reg-phone').value
  };

  const res = await sendRequest('/register/send-otp', data);
  if (res) {
    document.getElementById('verify-email').value = data.email;
  }
});

// 2. Verify Form Handler
document.getElementById('verify-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('verify-email').value,
    otp: document.getElementById('verify-otp').value
  };

  await sendRequest('/verify-otp', data);
});

// 3. Login Form Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };

  const res = await sendRequest('/login', data);
  if (res && res.token) {
    localStorage.setItem('token', res.token); // حفظ الـ JWT Token
  }
});

// 4. Forgot Password Form Handler
document.getElementById('forgot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('forgot-email').value
  };

  const res = await sendRequest('/forgot-password/send-otp', data);
  if (res) {
    document.getElementById('reset-email').value = data.email;
  }
});

// 5. Reset Password Form Handler
document.getElementById('reset-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('reset-email').value,
    otp: document.getElementById('reset-otp').value,
    newPassword: document.getElementById('reset-new-password').value
  };

  await sendRequest('/forgot-password/verify-otp', data);
});