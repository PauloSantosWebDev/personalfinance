//Functions

async function deleteLine (value) {
  // const item = document.getElementById('js-input-customer-supplier').value;
  console.log('The value is: ' + value);
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({value})
  };

  const response = await fetch('/categories', options);
  // console.log('The response is:' + JSON.stringify(response));
  
  const data = await response.json();
  console.log(data);

  return;
  // return data.body;
};

//End of functions

//------------------------------------------------------
//Listeners

// //Listening to update calls
// document.querySelectorAll('.js-btn-update').forEach((e, i) => {
//   e.addEventListener('click', () => {
//     console.log('value is: ' + e.value);
//     // updateLine();
//   })
// })

//Listening to delete calls
document.querySelectorAll('.js-btn-delete').forEach((e, i) => {
  e.addEventListener('click', async () => {
    console.log('value is: ' + e.value);
    await deleteLine(e.value);
  })
})
//End of listeners