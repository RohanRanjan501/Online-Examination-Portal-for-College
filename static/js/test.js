$(".options-container button").on("click", function(event){
  $(".options-container button").removeClass("btn-warning");
  $(".options-container button").addClass("btn-outline-dark");
  $(this).removeClass("btn-outline-dark");
  $(this).addClass("btn-warning");
  var buttonId = $(this).attr("id");
});

