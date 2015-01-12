# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
id=""
follow = () ->
  id = $('#follow').data "username"
  console.log(id);
  $.post("/add",
    ide: id
  ).done (data) ->
    console.log id
    type = $("#ftext").text()
    if type is "Unfollow"
      $("#ftext").text "Follow"
    else
      $("#ftext").text "Unfollow"
    
  .fail ->
  	console.log "ERROR ADDING THIS GUY"
  return

#Ejecution Events
window.setTimeout (->
  follow_btn = document.getElementsByClassName('follow')[0]
  follow_btn.addEventListener "click", follow, false
  angular.element('#controller').scope().get_friends @u.id
  
  return
), 1200