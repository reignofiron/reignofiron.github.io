var
  apiKey = "39424dade4d141af9a0807725a14ed20",
  groupID = "2974952";

$.ajax({
  url: "https://www.bungie.net/platform/GroupV2/" + groupID + "/Members/",
  headers: {
    "X-API-Key": apiKey
  }
}).done(function(json) {
  var memberList = json.Response.results;
  console.log(memberList);
  listMembers(memberList);

});

function listMembers(rsp) {

  for (var i = 0; i < rsp.length; i++) {

    var
      profile = rsp[i].bungieNetUserInfo,
      row = $('<div></div>'),
      list = $('section.members').find('.content');

    console.log(rsp[i].destinyUserInfo.displayName);

    if (typeof profile != 'undefined') {

      var
        name = rsp[i].destinyUserInfo.displayName,
        joined = rsp[i].joinDate,
        online = rsp[i].isOnline,
        icon = profile.iconPath,
        memberID = profile.membershipId;

      row
        .addClass('j-row member vertical-center-row')
        .html(
          '<div class="j-col j-col-1 member-icon"><img src="https://bungie.net/' + icon + '"></div>' +
          '<div class="j-col j-col-3 member-name"><h3>' + name + '</h3></div>' +
          '<div class="j-col j-col-3 member-joined" data-label="Joined">' + joined.substring(0, joined.indexOf('T')).replace(/-/g, '/') + '</div>' +
          '<div class="j-col j-col-3 member-status" data-label="Status"><span class="member-online" id="status-' + memberID + '">' + online + '</span></div>' +
          '<div class="j-col j-col-3 member-button"><a class="button gold full-width" target="_blank" href="https://bungie.net/en/Profile/254/' + memberID + '">' + 'Bungie Profile' + '</a></div>'
        )
        .appendTo(list);

      if (online === 'true') {
        $('#status-' + memberID).text('Online').addClass('online');
      } else {
        $('#status-' + memberID).text('Offline').removeClass('online');
      }

    }

  }

}
