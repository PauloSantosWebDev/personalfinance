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
document.querySelectorAll('.js-credit-date').forEach(e => {
  e.innerHTML = revertDate(e.innerHTML);
})

const currencyFormater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

document.querySelectorAll('.js-credit-amount').forEach(e => {
  e.innerHTML = currencyFormater.format(e.innerHTML);
})


//End of functions
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//------------------------------------------------------
//Async functions

async function loadDatesForDebtor () {
  const selection = document.getElementById('inputDebtor').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({selection})
  };

  const response = await fetch('/paymentreceived', options);
  
  const data = await response.json();

  return data.body;
};

//End of async functions
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//------------------------------------------------------
//Listeners

document.getElementById('inputDebtor').addEventListener('change', async () => {
  const arrayFromFunction = await loadDatesForDebtor();
  let accumHTML = '';

  arrayFromFunction.forEach((e, i) => {
    accumHTML += `<option value="${i}">${e.date}</option>`
  })
  
  document.getElementById('inputDateCreated').innerHTML = accumHTML;

})

//End of listeners