// --- 1. FIREBASE INITIALIZATION ---
// PASTE YOUR UNIQUE firebaseConfig OBJECT FROM THE FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyCMlKvQpIMMmag55r15PhRf3yqdRT1lwDs",
  authDomain: "scbrai-73da5.firebaseapp.com",
  projectId: "scbrai-73da5",
  storageBucket: "scbrai-73da5.firebasestorage.app",
  messagingSenderId: "130047039913",
  appId: "1:130047039913:web:d66f86dfd6275bbade0cb8"
};
// --- ENABLE OFFLINE MODE ---
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn("Firestore persistence failed: multiple tabs open.");
    } else if (err.code == 'unimplemented') {
        console.warn("Firestore persistence not available in this browser.");
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const DOM = {
        loginScreen: document.getElementById('login-screen'),
        appContainer: document.getElementById('app-container'),
        loginForm: document.getElementById('login-form'),
        sidebarNav: document.querySelector('.sidebar-nav'),
        views: document.querySelectorAll('.view-section'),
        loggedInUser: document.getElementById('loggedInUser'),
        logoutBtn: document.getElementById('logoutBtn'),
    };

    let state = {
        currentUser: null,
        patients: []
    };

    // --- AUTHENTICATION ---
    auth.onAuthStateChanged(user => {
        if (user) {
            state.currentUser = { email: user.email, uid: user.uid };
            showMainApp();
            listenForPatientData();
        } else {
            state.currentUser = null;
            showLoginScreen();
        }
    });

    const handleLogin = (e) => {
        e.preventDefault();
        const email = DOM.loginForm.username.value;
        const password = DOM.loginForm.password.value;
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => showToast(error.message, 'error'));
    };

    const handleLogout = () => {
        auth.signOut();
    };

    const showLoginScreen = () => {
        DOM.loginScreen.classList.remove('hidden');
        DOM.appContainer.classList.add('hidden');
    };

    const showMainApp = () => {
        DOM.loginScreen.classList.add('hidden');
        DOM.appContainer.classList.remove('hidden');
        DOM.loggedInUser.textContent = state.currentUser.email;
    };

    // --- DATA HANDLING ---
    function listenForPatientData() {
        db.collection("patients").orderBy("date", "desc").onSnapshot((querySnapshot) => {
            state.patients = [];
            querySnapshot.forEach((doc) => {
                state.patients.push(doc.data());
            });
            renderRecordsTable();
            updateDashboard('today');
        }, (error) => {
            console.error("Error listening for data: ", error);
            showToast("Could not sync data.", "error");
        });
    }

    // --- UI & OTHER FUNCTIONS ---
    const showToast = (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const renderRecordsTable = () => { /* Add your table rendering logic here */ };
    const updateDashboard = (period) => { /* Add your dashboard logic here */ };

    // --- EVENT LISTENERS ---
    DOM.loginForm.addEventListener('submit', handleLogin);
    DOM.logoutBtn.addEventListener('click', handleLogout);
});