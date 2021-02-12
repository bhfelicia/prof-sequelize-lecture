module.exports = (skaters) => {
   return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Skaters</title>
    </head>
    <body>
    <h1>There are ${skaters.length} Skaters</h1>
    <form action ="/skaters" method="post">
        <label for="name">Enter Name:</label>
        <input type="text" autocomplete="off" name="name"/>
        <button type="submit">Add Skater</button>
    </form>
    <ul>
        ${skaters.map((skater) => {
            console.log("map", skater.name)
            return `
            <li><h3>${skater.name}</h3></li>
            <form method="POST" action="/skaters/${skater.id}?_method=DELETE"><button>Delete Skater</button></form>
            `
        }).join("")}
        </ul>
    </body>
    </html>`
}