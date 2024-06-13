document.querySelector("#signIn").addEventListener("click", () => {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  document.querySelector(
    "#signIn"
  ).innerHTML = `<div class="d-flex align-items-center">
  <strong role="status">Signing in...</strong>
  <div class="spinner-border ms-auto" aria-hidden="true"></div>
</div>`;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      const uid = user.uid;
    })
    .then(() => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      document.querySelector("#signIn").innerText = "Sign in";
      console.error(error);
    });
});
