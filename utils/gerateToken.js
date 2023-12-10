const JWT = require('jsonwebtoken');
module.exports = async(payload)=>{
 const token = await JWT.sign(payload ,process.env.JWT_SECRET , {expiresIn : '1d'} )
return token;
}