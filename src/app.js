//modules
const express = require('express');
const path = require('path');

//data storage
class artData
{
	constructor(date, title, art, tags)
	{
		this.title = title;
		this.date = date;
		this.art = art;
		this.tags = tags.toLowerCase().split(" ");
	}
}
const artDataArr = [new artData('2018-09-29', 'washington sq arch', 
` _______________
 |~|_________|~|
 |::::\\^o^/::::|
 ---------------
 |..|/     \\|..|
 ---        ----
 |  |       |  |
 |  |       |  |
 |  |       |  |
.|__|.     .|__|.`, 'architecture public'),
new artData('2018-09-30', 'boba',
`  ______
  ======
 /      \\
|        |-.
|        |  \\
|O.o:.o8o|_ /
|.o.8o.O.|
 \\.o:o.o/`, 'snack notmybestwork'),
new artData('2018-10-31', 'buddy',
`       ___
      /  /\\   |---.
      |__|/__ |---,\\
      |  \`   |=    \`
      |      /|
      |  .--' |
      |   |\\  |
      |   | \\ |
     /|   | | |
    \\/    |  \\|
___ /_____\\___|\\____`, 'halloween squad fashion')];


//express middleware, handlebars, logger setup
const app = express();
app.set('view engine', 'hbs');
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const logger = (req, res, next) => {
  console.log(req.method, req.path, req.query);
  next();
};
app.use(logger);
app.use((req, res, next) => {
  if(req.get('Host')) {
    next();
  } else {
    res.status(400).send('invalid request');
  }
});
app.use(express.urlencoded({extended: false}));

app.listen(3000);

//routes
app.get('/', function(req, res)
{
	const reversed = [];
	const filter = req.query.filter;
	//goes through tags of each item to see if they match filter
	for(let i = artDataArr.length - 1; i >= 0; i--)
	{
		if(!filter || filter.length === 0)
		{
			reversed.push(artDataArr[i]);
		}
		else
		{
			for(let j = 0; j < artDataArr[i].tags.length; j++)
			{
				if(artDataArr[i].tags[j] === filter)
				{
					reversed.push(artDataArr[i]);
					break;
				}
			}
		}
	}
	//if nothing fits, just add everything
	if(reversed.length === 0)
	{
		for(let i = artDataArr.length - 1; i >= 0; i--)
		{
			reversed.push(artDataArr[i]);
		}
	}
	res.render('home', {artDataArr:reversed});
});
app.get('/add', function(req, res)
{
	res.render('add');
});
app.post('/add', function(req, res)
{
	artDataArr.push(new artData(req.body.date, req.body.title, req.body.art, req.body.tags));
	res.redirect('/');
});
