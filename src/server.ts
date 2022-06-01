import express, { Request,Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Console } from 'console';

// validate url function
function isValidHttpUrl(url_string:string) {
  let url;
  
  try {
    url = new URL(url_string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get('/filteredimage',async (req:Request,res:Response)=>{
    let {image_url} = req.query;
    let bool = isValidHttpUrl(image_url)
  
    if (bool){
      try{
      const filterd_image_file = await filterImageFromURL(image_url)
      console.log(filterd_image_file)
      res.status(200).sendFile(filterd_image_file,()=>{
        deleteLocalFiles([filterd_image_file])
      })
   
      } catch(e){
        res.status(500)
      }
    } else{
    res.status(422).send({error:"query parameters",message:"url is malformed"})
    }
  })
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();