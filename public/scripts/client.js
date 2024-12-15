/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Initialize on page load
$(document).ready(function () {
  // Ensure the error message is hidden on page load
  $(".error-message").hide();
  
  // Validates that the tweet is not empty and does not exceed 140 characters.
  const validateTweet = (tweetText) => {
    if (!tweetText) {
      return "Tweet cannot be empty!";
    }
    if (tweetText.length > 140) {
      return "Tweet exceeds the maximum length of 140 characters!";
    }
    return null; // Valid tweet
  };

  // Function to show error messages. Accepts a message string and displays it in the error message container.
  const showError = (message) => {
    const $errorContainer = $(".error-message");
    $errorContainer.text(message).slideDown(); // Display the error message
  };

  // Function to hide error messages. Slides up and hides the error message container.
  const hideError = () => {
    $(".error-message").slideUp(); // Hide the error message
  };

  // Function to create a tweet element. Constructs a DOM tree for a tweet using jQuery and returns the tweet element.
  const createTweetElement = (tweet) => {
    // Create the main article container
    const $tweet = $("<article>").addClass("tweet");

    // Top Row
    const $topRow = $("<div>").addClass("row top-row");
    const $profilePicture = $("<div>")
      .addClass("profile-picture")
      .append(
        $("<img>")
          .attr("src", tweet.user.avatars)
          .attr("alt", `Profile picture of ${tweet.user.name}`)
      );
    const $name = $("<div>").addClass("name").text(tweet.user.name);
    const $username = $("<div>").addClass("username").text(tweet.user.handle);

    $topRow.append($profilePicture, $name, $username);

    // Content Row
    const $contentRow = $("<div>").addClass("row content").append(
      $("<p>").text(tweet.content.text) // Safely add text
    );

    // Bottom Row
    const $bottomRow = $("<div>").addClass("row bottom-row");
    const $date = $("<div>")
      .addClass("date")
      .text(timeago.format(tweet.created_at));
    const $icons = $("<div>")
      .addClass("icons")
      .append(
        $("<i>").addClass("fa-solid fa-retweet"),
        $("<i>").addClass("fa-solid fa-flag"),
        $("<i>").addClass("fa-solid fa-heart")
      );

    $bottomRow.append($date, $icons);

    // Append all rows to the tweet container
    $tweet.append($topRow, $contentRow, $bottomRow);

    return $tweet;
  };

  // Function to render tweets. Accepts an array of tweets and renders them in the tweets container.
  const renderTweets = (tweets) => {
    $(".tweets-container").empty(); // Clear existing tweets

    // Loop through tweets array and append each to the container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet); // Generate tweet element
      $(".tweets-container").prepend($tweet); // Add new tweets to the top
    }
  };

  // Function to fetch tweets. Makes an AJAX GET request to fetch tweets and renders them on success.
  const loadTweets = () => {
    $.ajax({
      url: "/tweets", // Fetch tweets from the server endpoint
      method: "GET",
      dataType: "json",
      success: (tweets) => {
        renderTweets(tweets); // Render tweets to the page
      },
      error: (err) => {
        showError("Error: Unable to load tweets. Please try again later."); // Show error to the user
        console.error("Error loading tweets:", err); // Log error for debugging
      },
    });
  };

  // Event listener for form submission. Handles tweet form submissions, validates input, and sends data via AJAX.
  $(".new-tweet form").on("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission and page refresh

    hideError(); // Hide any existing error messages

    const tweetText = $("#tweet-text").val().trim(); // Get the tweet content and trim it
    const error = validateTweet(tweetText);

    if (error) {
      showError(error); // Show validation error
      return;
    }

    const serializedData = $(this).serialize(); // Serialize form data for submission

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
        showError("Error: Unable to post tweet. Please try again later."); // Show error to the user
        console.error("Error submitting tweet:", err); // Log error for debugging
      },
    });
  });

  // Event listener to hide error message on textarea focus. Hides the error message when the user focuses on the textarea.
  $("#tweet-text").on("focus", function () {
    hideError(); // Hide the error message when the user focuses on the textarea
  });

  loadTweets(); // Load tweets on page load
});
