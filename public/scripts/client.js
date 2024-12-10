/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Initialize on page load
$(document).ready(function () {

  // Function to create a tweet element
  const createTweetElement = (tweet) => {
    const timeAgo = timeago.format(tweet.created_at); // Use timeago to format the timestamp
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

  // Function to render tweets
  const renderTweets = function (tweets) {
    $(".tweets-container").empty(); // Clear existing tweets

    // Loop through tweets array and append each to the container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet); // Generate tweet element
      $(".tweets-container").prepend($tweet); // Add new tweets to the top
    }
  };

  // Function to fetch tweets
  const loadTweets = () => {
    $.ajax({
      url: "/tweets", // Fetch tweets from the server endpoint
      method: "GET",
      dataType: "json",
      success: (tweets) => {
        renderTweets(tweets); // Render tweets to the page
      },
      error: (err) => {
        console.error("Error loading tweets:", err);
      },
    });
  };

  // Event listener for form submission
  $(".new-tweet form").on("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission and page refresh

    const tweetText = $("#tweet-text").val(); // Get the tweet content
    const serializedData = $(this).serialize(); // Serialize form data for submission

    // Validate tweet text
    if (!tweetText) {
      alert("Tweet cannot be empty!"); // Notify user of empty tweet
      return;
    }
    if (tweetText.length > 140) {
      alert("Tweet exceeds the maximum length of 140 characters!"); // Notify user of too long tweet
      return;
    }

    // AJAX POST request to send the form data
    $.ajax({
      url: "/tweets", // Server endpoint for creating a new tweet
      method: "POST",
      data: serializedData,
      success: () => {
        $("#tweet-text").val(""); // Clear the textarea
        $(".counter").text("140"); // Reset the counter
        loadTweets(); // Reload tweets to display the new one
      },
      error: (err) => {
        console.error("Error submitting tweet:", err);
      },
    });
  });

  loadTweets(); // Load tweets on page load
});
