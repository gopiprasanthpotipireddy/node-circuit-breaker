let express = require("express");
let router = express.Router();
const fetch = require("node-fetch");
const CircuitBreaker = require('opossum');
const options = {
  errorThresholdPercentage:80,
  rollingCountTimeout:10000,
  resetTimeout: 30000 // After 30 seconds, try again.
};

let counter=1
const api=async(url,counter)=>{ 
  let result = await fetch(url);
  console.log(counter)
  if(counter%2==0){
   throw new Error("Bad Gateway",)
  }
  else{
    return result.body
  }
  
  //console.log(result.body)
}

const fetchWeatherUpdates=async(req,res,next)=>{
  const url=`https://api.publicapis.org/entries`
  try{
    const result=await weatherCircuitBreaker.fire(url,counter,options)
    counter++
    return res.send(result);
  }
  catch(err){
    console.log(err)
    next(err)
  }
 
 }

const weatherCircuitBreaker= new CircuitBreaker(api,options)
// weatherCircuitBreaker.fallback(() => `weather unavailable right now. Try later.`)

/* GET  listing. */
router.get("/",fetchWeatherUpdates)

 
module.exports = router;
