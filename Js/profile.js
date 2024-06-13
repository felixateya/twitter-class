firebase.auth().onAuthStateChanged((user) => {
  if (user !== null) {
    const uid = user.uid;
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((userDoc) => {
        const username = userDoc.data().username;
        const profileImg = userDoc.data().profileImg;
        const bio = userDoc.data().bio;
        console.log(username);
        document.querySelector("#username").innerText = username;
        document.querySelector("#profName").innerText = username;
        document.querySelector("#profUserNamed").innerText = `@${username}`;

        document.querySelector(".profilePlaceholder").src = profileImg;
        document.querySelector("#mainProfImage").src = profileImg;
        document.getElementById("bio").innerText = !bio ? "": bio;

        //fill the edit account page
        document.getElementById("edtName").value = username;
        document.getElementById("edtBio").value = !bio ? '...' : bio;
      });
    // update account info
    document.querySelector("#saveChanges").addEventListener("click", () => {
      var edtName = document.querySelector("#edtName").value;
      var edtBio = document.querySelector("#edtBio").value;

      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          username: edtName,
          bio: edtBio,
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    });
    // update profile image
    document.querySelector("#upload").addEventListener("click", () => {
      let profileImage = document.querySelector("#profileImage").files[0];
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef
        .child("/profile")
        .child(Math.random() + profileImage.name)
        .put(profileImage);
      uploadTask.on(
        "status_changed",
        (snapshot) => {
          //trying to estimate the % of image uploaded
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let wholeNumber = Math.round(progress);

          //showing the progress on html
          document.getElementById("progress").innerText =
            wholeNumber + "%. Uploading";

          //progressbar
          document.getElementById("progressBar").style.width =
            wholeNumber + "%";
        },
        (error) => {
          console.error(error);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((url) => {
              firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .update({
                  profileImg: url,
                })
                .then(() => {
                  window.location.reload();
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      );
    });

    firebase
      .firestore()
      .collection("users")
      .get()
      .then((queryUser) => {
        queryUser.forEach((userDoc) => {
          let userId = userDoc.data().userid;
          let username = userDoc.data().username;
          let profileImge = userDoc.data().profileImg;
          firebase
            .firestore()
            .collection("tweets")
            .orderBy("timestamp", "desc")
            .get()
            .then((queryTweet) => {
              let content = "";
              queryTweet.forEach((tweetDoc) => {
                let tweet = tweetDoc.data().tweet;
                let tweetuserid = tweetDoc.data().userid;
                let tweetid = tweetDoc.data().tweetid;
                console.log(tweet);
                if(uid === tweetuserid && userId === tweetuserid){
                  content += `
  <div class="d-flex" style="border-bottom: 1px solid rgba(128, 128, 128, 0.168); margin-top: 20px; padding-left: 30px; padding-right: 30px;">
    <div class="profilePlaceholderHome">
      <img src="${profileImge}">
    </div>
    <div style="margin-left: 20px;">
      <div class="d-flex" style="justify-content: space-between; width: 100%;">
        <div class="d-flex">
          <h6 style="margin-bottom: 0px;">${username}</h6>
          
        </div>
        
      </div>
      <p style="margin-top: 0px;">${tweet}</p>
      <div class="d-flex" style="justify-content: space-between; margin-bottom: 20px;width:100%">
      
      <div class="my-icons">
      <h6>
      <i class="fa-regular fa-comment likeIcon"></i>
      <p>0</p>
      </h6>
      <h6>
      <i class="fa-solid fa-retweet likeIcon"></i>
      <p>0</p>
      </h6>
      <h6>
      <i class="fa-regular fa-heart likeIcon"></i>
      <p>0</p>
      </h6>
    </div>
      </div>
    </div>
  </div>
`;
                }
              });
              $("#allTweetsContainer").append(content);
            });
        });
      });
  } else {
  }
});
