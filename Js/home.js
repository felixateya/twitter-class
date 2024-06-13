firebase.auth().onAuthStateChanged((user) => {
  if (user !== null) {
    // **  fecthing userid of the logged in user
    const uid = user.uid;

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
    document.querySelector("#tweetInput").addEventListener("keyup", () => {
      const tweet = document.querySelector("#tweetInput").value;
      if (tweet.length > 2) {
        document.querySelector("#tweetBtn").style.display = "block";
        document.querySelector("#disabledBtn").style.display = "none";
      } else {
        document.querySelector("#tweetBtn").style.display = "none";
        document.querySelector("#disabledBtn").style.display = "block";
      }
    });

    function generateTweetHTML(username, profileImg, tweet) {
      return `
        <div class="d-flex fade-in" style="border-bottom: 1px solid rgba(128, 128, 128, 0.168); margin-top: 20px; padding-left: 30px; padding-right: 30px;">
          <div class="profilePlaceholderHome">
            <img src="${profileImg}">
          </div>
          <div style="margin-left: 20px;">
            <div class="d-flex" style="justify-content: space-between; width: 100%;">
              <div class="d-flex">
                <h6 style="margin-bottom: 0px;">${username}</h6>
              </div>
            </div>
            <p style="margin-top: 0px;">${tweet}</p>
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
    document.querySelector("#tweetBtn").addEventListener("click", () => {
      const tweet = document.querySelector("#tweetInput").value;
      const sendtweet = firebase.firestore().collection("tweets").doc();
      sendtweet
        .set({
          tweet: tweet,
          userid: uid,
          tweetid: sendtweet.id,
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
              const tweetHTML = generateTweetHTML(username, profileImg, tweet);

              // Append the new tweet to the top of the tweets container
              document
                .querySelector("#allTweetsContainer")
                .insertAdjacentHTML("afterbegin", tweetHTML);

              // Clear the tweet input field and disable the tweet button
              document.querySelector("#tweetInput").value = "";
              document.querySelector("#tweetBtn").style.display = "none";
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
                if (userId === tweetuserid) {
                  // console.log(tweet);
                  content += `
  <div  class="d-flex" style="border-bottom: 1px solid rgba(128, 128, 128, 0.168); margin-top: 20px; padding-left: 30px; padding-right: 30px;">
    <div class="profilePlaceholderHome">
      <img src="${profileImge}">
    </div>
    
    <div style="margin-left: 20px;">
      <div class="d-flex" style="justify-content: space-between; width: 100%;">
        <div class="d-flex">
          <h6 style="margin-bottom: 0px;">${username}</h6>
          
        </div>
        
      </div>
      <p onclick="navigateToCommentPage(\'${tweetid}\')" style="margin-top: 0px;cursor:pointer">${tweet}</p>
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
              window.navigateToCommentPage = (id)=>{
                window.location.href = `comments.html?${id}`
              }
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
