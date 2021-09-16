import { parseFeed } from "https://deno.land/x/rss/mod.ts";

async function handleRequest(request) {
  var pathname = request.url;
  
  var isValid = true
  if (pathname.indexOf('/', 10) < 0)
    isValid = false
  
  pathname = pathname.substring(pathname.indexOf('/', 10)).replace('/','')
  if (!pathname.startsWith("http"))
    isValid = false
  
  if (!isValid) {
    const file = await Deno.readFile("./README.md")

    return new Response(file, {
      headers: {
        // The "text/html" part implies to the client that the content is HTML
        // and the "charset=UTF-8" part implies to the client that the content
        // is encoded using UTF-8.
        "content-type": "text/html; charset=UTF-8",
      },
    }); 
  }
  
  //const rssurl = `https://news.google.com/rss/search?ceid=ID:id&gl=ID&hl=id-ID&q=${pathname.replace('/', '')}`
  
  const response = await fetch(pathname,);
  
  if (response.ok) {
    // response.json() method reads the body and parses it as JSON.
    // It then returns the data in JavaScript object.
    
    const xml = await response.text();

    // Optional destructuring assignment
    const { entries } = await parseFeed(xml);
    
    return new Response(
      JSON.stringify({ result: entries }),
      {
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      },
    );
  }
  // fetch() doesn't throw for bad status codes. You need to handle them
  // by checking if the response.ok is true or false.
  // In this example we're just returning a generic error for simplicity but
  // you might want to handle different cases based on response status code.
  return new Response(
    JSON.stringify({ message: "couldn't process your request" }),
    {
      status: 500,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    },
  );
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
