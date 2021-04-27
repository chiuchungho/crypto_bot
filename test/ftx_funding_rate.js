const axios = require('axios');
const timestamp = Date.now();

axios.get('https://ftx.com/api/funding_rates', {
  })
  .then(res => {
    console.log(res.data.result.filter(function(result) {
        return result.rate > 0.0003;
      }));

  })
  .catch(err => {
    console.log(err);
  });



// axios.all([
//       axios.get('https://jsonplaceholder.typicode.com/todos/1'),
//       axios.get('https://jsonplaceholder.typicode.com/todos/2')
//     ]).then(axios.spread((res1, res2) => {
//       console.log(res1.data.title);
//       console.log(res2.data.title);
//     })).catch(err => {
//       console.log(err);
//     });