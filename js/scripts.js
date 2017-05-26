$(document).ready(function(){
//defines array of streams
var streamArr = ["ESL_SC2", "lurkor", "bmkibler"];

//makes an API call for each entry in streamArr, then creates a div element for each entry.
function getData(){
  var dataArr = [];
  for(i=0;i<streamArr.length;i++){
    var urlId = "https://wind-bow.gomix.me/twitch-api/streams/"+streamArr[i]+'?callback=?';
    dataArr.push(urlId);
    console.log(dataArr+i);
    $.getJSON(dataArr[i], function(data){
      console.log(data);
      var streamer = data._links.channel.slice(38,data._links.channel.length);
      var logo="https://qph.ec.quoracdn.net/main-qimg-3677855935f2ff9a672299288e78f4ec?convert_to_webp=true";
      if(!data.stream){//dead div
        $('#streamDiv').append("<div class='fullRow row dead'><div class='col-sm-1'><img class='logo' src='"+logo+"'></img></div><div class='col-sm-2'><a href='https://www.twitch.tv/"+streamer+"'><p class='streamer'>"+streamer+"</p></a></div><div class='col-sm-9 streamBox'><p class='deadTitle'><i>Stream is offline.</i></p></div></div>");
      }else{//live div
        var logo = data.stream.channel.logo;
        if(data.stream.channel.status.length>=96){
          var streamStatus = data.stream.channel.status.slice(0,93)+"...";
        } else{
          var streamStatus = data.stream.channel.status
        }
        $('#streamDiv').append("<div class='fullRow row live'><div class='col-sm-1'><a class='logo' href='https://www.twitch.tv/"+streamer+"'><img class='logo' src='"+logo+"'></img></a></div><div class='col-sm-2'><a  href='https://www.twitch.tv/"+streamer+"'><p class='streamer'>"+streamer+"</p></a></div><div class='col-sm-9 streamBox'><p class='gameTitle'>"+data.stream.game+"</p><p class='streamTitle'>"+streamStatus+"</p></div></div>");
      }//if/else for live/dead
    });//getJSON call
  }//for loop
}//getData function
getData();

//allows users to add their own streams via text field input. If the user exists, will add to stream array and rerun the getData function. If not, will return error msg.
$("#addForm").submit(function(event){
  event.preventDefault ();
  var submitVal = document.getElementById("addStreamField").value;
  $.ajax({
    url: 'https://wind-bow.gomix.me/twitch-api/users/'+submitVal+'?callback=?',
    dataType: 'json',
    success: function(data) {
      if(data.status==404){
        alert("That streamer doesn't exist.");
      } else{
        streamArr.push(submitVal);
        $(".live").remove();
        $(".dead").remove();
        getData();
        $("#liveCheck").prop("checked", true);
        $("#deadCheck").prop("checked", true);
      }
    },
  });//ajax user call
})//form submit function

//Toggle functions to filter live/dead streams
$("#liveCheck").click(function(){
  $(".live").toggle();
});
$("#deadCheck").click(function(){
  $(".dead").toggle();
});

});//document ready
