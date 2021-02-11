const {db, syncAndSeed, models: { Skater } } = require('./db');
const express = require('express');

const app = express();


//ROUTES
app.get('/skaters', async (req, res, next) => {
    try {
        const skaters = await Skater.findAll();
        res.send(skaters);
    } catch (error) {
        next(error)
    }
})




//INIT: I wrote it without a name and just called it immediately by using () right after the function just like in Treehouse, but you can also give this function a name then call it right after the normal way, functionName();
(async () => {
    try {
        //1. Check database connection
        await db.authenticate();
        console.log("Connection successful");

        //1a. Setting up port stuff
        const port = 3000;
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })

        //2. Create table(s)
       await syncAndSeed();

       //3. create new instance aka new row
       const person = new Skater({
           name: 'Tony Hawk',
        //    pictureUrl: '/tony_hawk.jpg',
       })
       //4. add new row to table
       await person.save();
       //4a. Creating multiple rows
    const mappingPeople = [
        {name: 'Mike Vallely', pictureUrl: '/mike_v.jpg'},
        {name: 'Rick McCrank', pictureUrl: '/mccrankers.jpg'},
        {name: 'Daewon Song', pictureUrl: '/daewon_song.jpg'}
    ]
    //4b. Adding multiple rows to table
    mappingPeople.map((person) => {
        const skater =  new Skater({name: person.name, pictureUrl: person.pictureUrl})
        skater.save();
    })

    //5. Creating new row using .create() like treehouse
    const skater5 = await Skater.create({
        name: 'Rodney Mullen', pictureUrl: '/rodney_mullen.jpg'
    })

    // console.log("skater5", skater5.toJSON())

    //6. Using Promise.all like in treehouse
    const moreSkaters = await Promise.all([
        Skater.create({
            name: 'Bob Burnquist', pictureUrl: '/burnquist.jpg'
        }),

        Skater.create({
            name: 'John Rattray', pictureUrl: '/john_rattray.jpg'
        })
    ])

    const moreSkatersJSON = moreSkaters.map((skater) => {
        return skater.toJSON();
    })

    // console.log(moreSkatersJSON) //rattray and burnquist

    //7. Using map and Promise.all like in treehouse
    const mappingSkatersPromise = [
        {name: 'Ray Barbee', pictureUrl: '/ray_barbee.jpg'},
        {name: 'Elijah Berle', pictureUrl: '/elijah_berle.jpg'},
        {name: 'Lizzie Armanto', pictureUrl: '/lizzie_armanto.jpg'},
        {name: 'Billy Marks', pictureUrl: '/billy_marks.jpg'}
    ].map((skater) => {
        return Skater.create({
            name: skater.name,
            pictureUrl: skater.pictureUrl
        })
    })

    await Promise.all([...mappingSkatersPromise])

    //.findAll() is basically a SELECT * FROM table query
    // console.log("logging...", await User.findAll());

    } catch (err) {
        console.log(err)
    }
})();