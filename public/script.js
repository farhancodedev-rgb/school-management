
/* Dynamic Back to Dashboard */
function goToDashboard() {
    window.location.href = "/";
}

/* Global Logout */
async function logout() {
    try {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.log("Logout error:", error);
    }

    window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("navLogout");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});
