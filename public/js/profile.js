document.addEventListener("DOMContentLoaded", function () {
  // This script runs when  user is viewing own profile
  const avatarContainer = document.querySelector(".avatar-container");

  if (avatarContainer && document.getElementById("editAvatarIcon")) {
    const avatarInput = document.getElementById("avatarInput");
    const avatarForm = document.getElementById("avatarForm");

    // trigger the hidden file input
    avatarContainer.addEventListener("click", () => {
      avatarInput.click();
    });

    // automatically submit the form
    avatarInput.addEventListener("change", () => {
      if (avatarInput.files.length > 0) {
        avatarForm.submit();
      }
    });
  }
});
