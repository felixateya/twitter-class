document.querySelector("#signUp").addEventListener("click", () => {
  let username = document.querySelector("#username").value;
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  document.querySelector(
    "#signUp"
  ).innerHTML = `<div class="d-flex align-items-center">
  <strong role="status">Creating account...</strong>
  <div class="spinner-border ms-auto" aria-hidden="true"></div>
</div>`;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .set({
          username: username,
          email: email,
          userid: uid,
          profileImg:
            "https://firebasestorage.googleapis.com/v0/b/twitter-class.appspot.com/o/0.020731118214122324prof-image.jpg?alt=media&token=642cb77c-aab5-4f56-bf19-4196e389ece8",
          timestamp: new Date().getTime(),
        })
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          document.querySelector("#signUp").innerText = "Sign Up";
          console.error(error);
        });
    })
    .catch((error) => {
      document.querySelector("#signUp").innerText = "Sign Up";
      console.error(error);
    });
});
