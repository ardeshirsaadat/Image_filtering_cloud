import express from 'express';
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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage',async (req,res)=>{
    let {image_url} = req.query;
    let bool = isValidHttpUrl(image_url)
  
    if (bool){
      try{
        console.log(image_url)
      const filterd_image_file = await filterImageFromURL(image_url)
 
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
  //! END @TODO1
  
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