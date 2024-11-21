$(document).ready(function () {
  const maxChars = 140;

  $("#tweet-text").on("input", function () {
    const $textarea = $(this); // Convert `this` to a jQuery object
    const $counter = $textarea.closest("form").find(".counter"); // Traverse DOM to find the associated counter

    const remainingChars = maxChars - $textarea.val().length;
    $counter.text(remainingChars);

    if (remainingChars < 0) {
      $counter.addClass("exceeded");
    } else {
      $counter.removeClass("exceeded");
    }
  });
});
