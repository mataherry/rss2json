import { parseFeed } from "https://deno.land/x/rss/mod.ts";

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  
  //const rssurl = `https://news.google.com/rss/search?ceid=ID:id&gl=ID&hl=id-ID&q=${pathname.replace('/', '')}`
  const response = await fetch(pathname.replace('/',''),);
//     "http://static.userland.com/gems/backend/rssTwoExample2.xml",
//   );
  
  // The .ok property of response indicates that the request is
  // sucessfull (status is in range of 200-299).
  if (response.ok) {
    // response.json() method reads the body and parses it as JSON.
    // It then returns the data in JavaScript object.
    
    const xml = await response.text();

    // Optional destructuring assignment
    const { entries } = await parseFeed(xml);
    
//     const { name, login, avatar_url } = await response.json();
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
