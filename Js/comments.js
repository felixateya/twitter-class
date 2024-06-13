firebase.auth().onAuthStateChanged((user) => {
  if (user !== null) {
    // **  fecthing userid of the logged in user
    const uid = user.uid;
    var selectId = decodeURIComponent(window.location.search);
    var selectTweetId = selectId.substring(1);

    // **  fetching the logged in User's data
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((userDoc) => {
        const username = userDoc.data().username;
        const profileImg = userDoc.data().profileImg;
        console.log(username);
        document.querySelector("#username").innerText = username;
        document.querySelector("#profilePlaceholderleft").src = profileImg;
        document.querySelector("#profilePlaceholdercenter").src = profileImg;
      });

    //  ** validation of the input for tweets
    document.querySelector("#commentInput").addEventListener("keyup", () => {
      const tweet = document.querySelector("#commentInput").value;
      if (tweet.length > 2) {
        document.querySelector("#commentBtn").style.display = "block";
        document.querySelector("#disabledBtn").style.display = "none";
      } else {
        document.querySelector("#commentBtn").style.display = "none";
        document.querySelector("#disabledBtn").style.display = "block";
      }
    });

    function generateCommentHTML(username, profileImg, comment) {
        
      return `
          <div class="d-flex fade-in" style="border-bottom: 1px solid rgba(128, 128, 128, 0.168); margin-top: 20px; padding-left: 30px; padding-right: 30px;">
            <div class="profilePlaceholderHome">
              <img src="${profileImg}">
            </div>
            <div style="margin-left: 40px;">
              <div class="d-flex" style="justify-content: space-between">
                <div class="d-flex">
                  <h6 style="margin-bottom: 0px;">${username}</h6>
                </div>
              </div>
              <p style="margin-top: 0px;">${comment}</p>
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
          </div>`;
    }

    // **  creating a tweet collection
    document.querySelector("#commentBtn").addEventListener("click", () => {
      const comment = document.querySelector("#commentInput").value;
      const sendcomment = firebase.firestore().collection("comments").doc();
      sendcomment
        .set({
          comment: comment,
          userid: uid,
          commentid: sendcomment.id,
          tweetid: selectTweetId,
          timestamp: new Date().getTime(),
          likes: 0,
          comments: 0,
          retweets: 0,
        })
        .then(() => {
          // Fetch user data again to get the latest username and profile image
          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((userDoc) => {
              const username = userDoc.data().username;
              const profileImg = userDoc.data().profileImg;
              const tweetHTML = generateCommentHTML(
                username,
                profileImg,
                comment
              );

              // Append the new tweet to the top of the tweets container
              document
                .querySelector("#allCommentsContainer")
                .insertAdjacentHTML("afterbegin", tweetHTML);

              // Clear the tweet input field and disable the tweet button
              document.querySelector("#commentInput").value = "";
              document.querySelector("#commentBtn").style.display = "none";
              document.querySelector("#disabledBtn").style.display = "block";
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // ** Fetching Tweets
    firebase
      .firestore()
      .collection("users")
      .orderBy("timestamp", "desc")
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
                if (userId === tweetuserid && tweetid === selectTweetId) {
                  // console.log(tweet);
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
        <div class="d-flex" style="justify-content: space-between; width:100%">
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
              firebase
                .firestore()
                .collection("comments")
                .get()
                .then((queryComments) => {
                  let content = "";

                  queryComments.forEach((commentDoc) => {
                    const comment = commentDoc.data().comment;
                    const commentTweetId = commentDoc.data().tweetid;
                    const commentUserId = commentDoc.data().userid;
                    if (commentTweetId === selectTweetId && userId ===commentUserId ) {
                      console.log(comment);
                      content += `
          <div class="d-flex fade-in" style="border-bottom: 1px solid rgba(128, 128, 128, 0.168); margin-top: 20px; padding-left: 30px; padding-right: 30px;">
            <div class="profilePlaceholderHome">
              <img src="${profileImge}">
            </div>
            <div style="margin-left: 20px;">
              <div class="d-flex" style="justify-content: space-between; width: 100%;">
                <div class="d-flex">
                  <h6 style="margin-bottom: 0px;">${username}</h6>
                </div>
              </div>
              <p style="margin-top: 0px;">${comment}</p>
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
          </div>`;
                    }
                  });
                  $("#allCommentsContainer").append(content);
                });
            });
        });
      });

    // ** Logging out a user
    document.querySelector("#logout").addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = "index.html";
        });
    });
  } else {
    // ** User is NOT authenticated
    window.location.href = "index.html";
    // ** user is redirected back to login page
  }
});
