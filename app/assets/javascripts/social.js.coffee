# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

follow = () ->
  id = $('#follow').data "username"
  $.post("/add",
    username: id
  ).done (data) ->
    console.log id
    type = $("#ftext").text()
    if type is "Unfollow"
      $("#ftext").text "Follow"
    else
      $("#ftext").text "Unfollow"
    return

  return

window.setTimeout (->
  follow_btn = document.getElementsByClassName('follow')[0];
  console.log follow_btn
  follow_btn.addEventListener "click", follow, false
  return
), 600
