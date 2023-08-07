//Functions

//Used to show date in the format dd-mm-yyyy and not yyyy-mm-dd
function revertDate (strg) {
  let initial = '';
  let middle = '';
  let final = '';
  let result = '';
  
  for (let i = 0; i < strg.length; i++) {
    if (i <= 3) {
      final += strg[i];
    }
    else if (i <= 7) {
      middle += strg[i];
    }
    else {
      initial += strg[i];
    }
  }
  result = initial + middle + final;
  return result;
}

//Used to call the function to invert the date in all the due fields
document.querySelectorAll('.js-debt-date').forEach(e => {
  e.innerHTML = revertDate(e.innerHTML);
})

const currencyFormater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

document.querySelectorAll('.js-debt-amount').forEach(e => {
  e.innerHTML = currencyFormater.format(e.innerHTML);
})


//End of functions
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//------------------------------------------------------
//Async functions


//End of async functions
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//------------------------------------------------------
//Listeners


//End of listeners