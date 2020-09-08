var yourname = prompt('Enter Your Name').toLowerCase();
var friendname = prompt('Enter Your Friend Name').toLowerCase();
var firebase_DB = firebase.database();

document.getElementById('friendname').innerText = friendname;

function sendMessage () {
    var messageText = document.getElementById('messagebox');
    var key = firebase_DB.ref(`messages/${yourname + friendname}`).push().key;
    var messageData = {
        sender : yourname,
        id : key,
        message : messageText.value
    } 
    
    if(messageText.value == ''){
        alert('Please Enter Some Message');
    } else {
        firebase_DB.ref(`messages/${yourname + friendname}`).child(key).set(messageData);
        firebase_DB.ref(`messages/${friendname + yourname}`).child(key).set(messageData);
        messageText.value = ""; 
    }
    return false;
}


firebase_DB.ref(`messages/${yourname + friendname}`).on('child_added' , function (msg) {

    if(msg.val().sender == yourname){

        if(msg.val().message == 'This Message Was Deleted'){
            var allmessagesbox = document.getElementById('msgbox');
            var singlemsgmain = document.createElement('div');
            singlemsgmain.setAttribute('class' , 'messagesendmain');
            var singlemsginner = document.createElement('div');
            singlemsginner.setAttribute('class' , 'sendmsg');
            singlemsginner.style.backgroundColor = 'red';
            allmessagesbox.appendChild(singlemsgmain).appendChild(singlemsginner).innerHTML = `<p>${msg.val().message}</p>`
        } else {
            var allmessagesbox = document.getElementById('msgbox');
            var singlemsgmain = document.createElement('div');
            singlemsgmain.setAttribute('class' , 'messagesendmain');
            var singlemsginner = document.createElement('div');
            singlemsginner.setAttribute('class' , 'sendmsg');
            allmessagesbox.appendChild(singlemsgmain).appendChild(singlemsginner).innerHTML = `<p>${msg.val().message}</p><button class="deletebtn" onclick="deletemsg(this)" id="${msg.val().id}">Delete</button>`
        }

    } else if(msg.val().sender == friendname){

        if(msg.val().message == 'This Message Was Deleted'){
            var allmessagesbox1 = document.getElementById('msgbox');
            var singlemsgmain1 = document.createElement('div');
            singlemsgmain1.setAttribute('class' , 'messagemain');
            var singlemsginner1 = document.createElement('div');
            singlemsginner1.setAttribute('class' , 'sendermsg');
            singlemsginner1.style.backgroundColor = 'red';
            allmessagesbox1.appendChild(singlemsgmain1).appendChild(singlemsginner1).innerHTML = `<p id="${msg.val().id}">${msg.val().message}</p>`
        } else {
            var allmessagesbox1 = document.getElementById('msgbox');
            var singlemsgmain1 = document.createElement('div');
            singlemsgmain1.setAttribute('class' , 'messagemain');
            var singlemsginner1 = document.createElement('div');
            singlemsginner1.setAttribute('class' , 'sendermsg');
            allmessagesbox1.appendChild(singlemsgmain1).appendChild(singlemsginner1).innerHTML = `<p id="${msg.val().id}">${msg.val().message}</p>`
        }

    }

});


function deletemsg (e) {
    var deletemsgdata = {
        sender : yourname,
        id : e.id,
        message : "This Message Was Deleted"
    }
    firebase_DB.ref(`messages/${yourname + friendname}`).child(e.id).set(deletemsgdata);
    firebase_DB.ref(`messages/${friendname + yourname}`).child(e.id).set(deletemsgdata);
    e.previousSibling.innerText = 'This Message Was Deleted';
    e.parentElement.style.backgroundColor = 'red';
    e.remove();
}


firebase_DB.ref(`messages/${friendname + yourname}`).on('child_changed' , function (msg) {
    if(msg.val().message == 'This Message Was Deleted'){
        document.getElementById(msg.val().id).innerText = 'This Message Was Deleted';
        document.getElementById(msg.val().id).parentElement.style.backgroundColor = 'red';
    }
})







