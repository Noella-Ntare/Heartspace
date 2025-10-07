// View Artwork in Modal
function viewArtwork(art) {
  const modalHTML = `
    <div class="modal">
      <img src="${art.image}" alt="${art.title}">
      <h3>${art.title}</h3>
      <p>${art.description}</p>
      <button onclick="closeModal()">Close</button>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeModal() {
  document.querySelector(".modal").remove();
}

// Share Artwork
function handleShareArt(art) {
  if (navigator.share) {
    navigator.share({
      title: art.title,
      text: art.description,
      url: art.image
    }).catch(err => toast("Sharing failed: " + err.message, "error"));
  } else {
    toast("Sharing not supported on this device", "error");
  }
}

// Like Artwork
function likeArtwork(artId) {
  // Update likes in Firestore
  const artRef = db.collection("artworks").doc(artId);
  artRef.update({ likes: firebase.firestore.FieldValue.increment(1) })
    .then(() => fetchArtworks()) // Refresh gallery
    .catch(err => toast(err.message, "error"));
}
