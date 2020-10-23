var params = new URLSearchParams(window.location.search);
var username = params.get('name');
var party = params.get('party');

// jQuery references
var partyName = $('#partyName');
var divUsers = $('#divUsers');
var sendForm = $('#sendForm');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');


function renderPartyName() {
    var html = '';
    html += '<div class="p-20 b-b">';
    html += '   <h3 class="box-title">Party chat: <small>' + params.get('party') + '</small></h3>';
    html += '</div>';

    partyName.append(html);
}

// Rendering user functions
function renderUsers(people) {

    console.log(people);

    var html = '';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('party') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < people.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + people[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + people[i].name + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);

}

function renderMessages(message, i) {
    var html = '';
    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';

    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (i) {
        html += '<li class="reverse">';
        html += '   <div class="chat-content">';
        html += '   <h5>' + message.name + '</h5>';
        html += '       <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '       </div>';
        html += '   <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (message.name !== 'Admin') {
            html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '   <div class="chat-content">';
        html += '       <h5>' + message.name + '</h5>';
        html += '       <div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // Selectors
    var newMessage = divChatbox.children('li:last-child');

    // Heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }

}

// Listeners
divUsers.on('click', 'a', function() {

    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }

});

sendForm.on('submit', function(e) {

    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return;
    }

    socket.emit('createMessage', {
        user: username,
        message: txtMessage.val(),
    }, function(message) {
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });

})