import jwt from 'jsonwebtoken'; // Importing jwt to generate token
const jwtToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{ //this will create a token with the user id and jwt secret
        expiresIn:'30d' //this will set the time for the token to expire in 30 days
    })
    res.cookie('jwt',token,{
        httpOnly:true, //this will make the cookie http only so that it can't be accessed by the frontend
        maxAge:30*24*60*60*1000, //this will set the time for the cookie to expire in 30 days
        sameSite:'strict', //this will check if the site is same or not //strict means it will only work on the same site
        secure:true //this will check if the environment is in development or not
    })
}
export default jwtToken; //this will export the jwtToken function