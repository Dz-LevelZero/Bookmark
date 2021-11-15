const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show modal, Focus on Input
const showModal = () => {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
});
window.addEventListener('click', (e) => {
  // if (e.target === modal) {
  //   modal.classList.remove('show-modal');
  // }
  e.target === modal && modal.classList.remove('show-modal')
});

// Validate Form
const validate = (nameValue, urlValue) => {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert ("Please provide a valid web address")
    return false;
  }
  // Valid
  return true;
}

// Build Bookmarks 
const buildBookmarks = () => {
  // Remove all bookmark elements
  bookmarksContainer.textContent = '';
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add("far" , "fa-times-circle");
    closeIcon.setAttribute("title" , "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark("${url}")`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append to Bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item); 
  })
}

// Fetch bookmarks from local storage
const fetchBookmarks = () => {
  // Get bookmarks from local storage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create bookmarks array in local storage
    bookmarks = [
      {
        name: 'Google',
        url: 'https://www.google.com/',
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/"
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/"
      }
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmark
const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, index) => {
    if (bookmark.url === url) {
      bookmarks.splice(index, 1);
    }
  })
  // Update bookmarks array in local storage, repopulate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}
// Handle Data from Form
const storeBookmark = (e) => {
  e.preventDefault();
  // Get form values
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  // Check if url starts with http or https	
  if (!urlValue.startsWith('http', 'https')) {
    urlValue = `https://${urlValue}`;
  }

//   if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
//      urlValue = `https://${urlValue}`; 
// }

  // Validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  // Set bookmark object, add to array
  const bookmark = {
    name: nameValue,
    url: urlValue
  }
  // Save bookmark to local storage
  bookmarks.push(bookmark);
  // Set bookmarks in localStorage, fetch, reset input fields
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();