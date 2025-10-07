// Fetch posts from Firestore
function fetchPosts() {
  db.collection("posts").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderCommunityPage();
    })
    .catch(err => toast(err.message, "error"));
}

// Add post to Firestore
function addPostToDB(post) {
  db.collection("posts").add({
    ...post,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => toast("Post created!", "success"))
  .catch(err => toast(err.message, "error"));
}
