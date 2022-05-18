const getSecretValue = require('./getSecrets');


getSecretValue().then((secrets) => {
  console.log('Secrets fetched successfully', secrets);
}).catch(err =>{
  // starting app on env
  console.log(err);
  console.log('starting app without secrets from aws')
})