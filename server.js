const {
	db,
	syncAndSeed,
	models: { Skater },
} = require('./db');

const skatersList = require('./views/skaters');


const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(require('method-override')('_method'));
//ROUTES
app.get('/', (req, res) => {
    res.redirect('/skaters');
});

app.delete('skaters/:id', async (req, res, next) => {
	try {
		const skater = await Skater.findByPk(req.params.id);
		console.log(skater)
		// await skater.destroy();
		// res.redirect('/skaters')
	} catch (error) {
		next(error)
	}
});

app.post('/skaters', async (req, res) => {
    try {
        const newSkater = await Skater.create(req.body)
		res.redirect(`/skaters/${newSkater.id}`)
    } catch (error) {
		next(error)
    }
});

app.get('/skaters', async (req, res, next) => {
	try {
		const skaters = await Skater.findAll();
		res.send(skatersList(skaters));
	} catch (error) {
		next(error);
	}
});

app.get('/skaters/:id', async (req, res) => {
	const skaterProfile = [await Skater.findByPk(req.params.id)];
	console.log("profile", skaterProfile)
	res.send(`
	<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
${skaterProfile.map((skater) => {
	return `<h1>${skater.pictureUrl}</h1>`
})}
</body>
</html>
	`)
});

//INIT: I wrote it without a name and just called it immediately by using () right after the function just like in Treehouse, but you can also give this function a name then call it right after the normal way, functionName();
(async () => {
	try {
		//1. Check database connection
		await db.authenticate();
		console.log('Connection successful');
		//1a. Setting up port stuff
		const port = 3000;
		app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		});
		//2. Create table(s)
		await syncAndSeed();
		//3. create new instance aka new row
		const person = new Skater({
			name: 'Tony Hawk',
			//    pictureUrl: '/tony_hawk.jpg',
		});
		//4. add new row to table
		await person.save();
		//4a. Creating multiple rows
		const mappingPeople = [
			{ name: 'Mike Vallely', pictureUrl: '/mike_v.jpg' },
			{ name: 'Rick McCrank', pictureUrl: '/mccrankers.jpg' },
			{ name: 'Daewon Song', pictureUrl: '/daewon_song.jpg' },
		];
		//4b. Adding multiple rows to table
		mappingPeople.map((person) => {
			const skater = new Skater({
				name: person.name,
				pictureUrl: person.pictureUrl,
			});
			skater.save();
		});
		//5. Creating new row using .create() like treehouse
		const skater5 = await Skater.create({
			name: 'Rodney Mullen',
			pictureUrl: '/rodney_mullen.jpg',
		});
		// console.log("skater5", skater5.toJSON())
		//6. Using Promise.all like in treehouse
		const moreSkaters = await Promise.all([
			Skater.create({
				name: 'Bob Burnquist',
				pictureUrl: '/burnquist.jpg',
			}),
			Skater.create({
				name: 'John Rattray',
				pictureUrl: '/john_rattray.jpg',
			}),
		]);
		const moreSkatersJSON = moreSkaters.map((skater) => {
			return skater.toJSON();
		});
		// console.log(moreSkatersJSON) //rattray and burnquist
		//7. Using map and Promise.all like in treehouse
		const mappingSkatersPromise = [
			{ name: 'Ray Barbee', pictureUrl: '/ray_barbee.jpg' },
			{ name: 'Elijah Berle', pictureUrl: '/elijah_berle.jpg' },
			{ name: 'Lizzie Armanto', pictureUrl: '/lizzie_armanto.jpg' },
			{ name: 'Billy Marks', pictureUrl: '/billy_marks.jpg' },
		].map((skater) => {
			const newSkater = new Skater({
				name: skater.name,
				pictureUrl: skater.pictureUrl,
			})
			newSkater.save();
		});
		await Promise.all([...mappingSkatersPromise]);
		//.findAll() is basically a SELECT * FROM table query
		// console.log("logging...", await User.findAll());
	} catch (err) {
		console.log(err);
	}
})();