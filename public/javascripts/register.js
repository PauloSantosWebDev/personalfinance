//Functions

document.getElementById('js-btn-sign-up').addEventListener('click', () => {
  let isWrong = false;
  const empty = document.querySelectorAll('.js-check').forEach((e) => {
    if (e.value == '') {
      isWrong = true;
    }
  })
  if (isWrong) {
    alert("None of the fields can be empty");
    return
  }
  else if (document.getElementById('password').value != document.getElementById('passwordConfirmation').value) {
    alert("Please make sure the password and password confirmation match");
    return
  }
  else {
    document.forms[0].submit();
  }
  
})

//End of functions
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//------------------------------------------------------
//Listeners


//End of listeners