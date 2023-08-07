//Functions

//Function that use the fetch() method to delete a category line in the database. 
async function deleteLine (value) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({value})
  };
  const response = await fetch('/categories', options);
  const data = await response.json();
  console.log(data);
  return data;
};

//End of functions

//------------------------------------------------------
//Listeners

//Listening to delete calls
document.querySelectorAll('.js-btn-delete').forEach((e, i) => {
  e.addEventListener('click', async () => {
    const del = await deleteLine(e.value);    
    if (del['status'] === 'success') {
      location.reload();
    }
  })
})
//End of listeners