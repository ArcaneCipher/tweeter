/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Function to create a tweet element
const createTweetElement = (tweet) => {
  const timeAgo = new Date(tweet.created_at).toLocaleString(); // Temporary time formatting
  const $tweet = $(`
    <article class="tweet">
      <!-- Top Row -->
      <div class="row top-row">
        <div class="profile-picture">
          <img src="${tweet.user.avatars}" alt="Profile picture of ${tweet.user.name}" />
        </div>
        <div class="name">${tweet.user.name}</div>
        <div class="username">${tweet.user.handle}</div>
      </div>

      <!-- Content Row -->
      <div class="row content">
        <p>${tweet.content.text}</p>
      </div>

      <!-- Bottom Row -->
      <div class="row bottom-row">
        <div class="date">${timeAgo}</div>
        <div class="icons">
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </div>
    </article>
  `);

  return $tweet;
};

const renderTweets = function (tweets) {
  // Empty the container to prevent duplicate tweets
  $(".tweets-container").empty();

  // Loop through tweets array and append each to the container
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet); // Generate tweet element
    $(".tweets-container").append($tweet); // Append to container
  }
};

// Function to fetch tweets
const loadTweets = () => {
  $.ajax({
    url: "/tweets", // Fetch tweets from the server endpoint
    method: "GET",
    dataType: "json",
    success: (tweets) => {
      console.log("Tweets loaded:", tweets); // Debug: Log fetched tweets
      renderTweets(tweets); // Render tweets to the page
    },
    error: (err) => {
      console.error("Error loading tweets:", err);
    },
  });
};

// Initialize on page load
$(document).ready(function () {
  loadTweets(); // Load tweets on page load
});
