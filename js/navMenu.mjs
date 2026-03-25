const menuButton = document.getElementById("menu-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const loginLink = document.getElementById("login-link");
const dashboardLink = document.getElementById("dashboard-link");

const isLoggedIn = !!localStorage.getItem("accessToken");
if (isLoggedIn) {
  loginLink.classList.add("hidden");
  dashboardLink.classList.remove("hidden");
} else {
  loginLink.classList.remove("hidden");
  dashboardLink.classList.add("hidden");
}

menuButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const isHidden = dropdownMenu.classList.contains("hidden");

  if (isHidden) {
    dropdownMenu.classList.remove("hidden");
    menuButton.setAttribute("aria-expanded", "true");
  } else {
    dropdownMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("click", (event) => {
  if (
    !dropdownMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    dropdownMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }
});