'use strict';

const express = require('express');
const app = express();
const nunjucks = require('express-nunjucks');
const filters = require('./nunjucks/filters/index');
const config = require('./config');
const path = require('path');
const compression = require('compression');

let nunjucksConfig = {
  autoescape: true
};

if (config.env !== 'production') {
  nunjucksConfig.noCache = true;
}

app.use(compression());
app.set('view engine', 'html');
app.set('views', [
  path.resolve('./gallery/views'),
  path.resolve('./test'),
  path.resolve('./node_modules/govuk_template_jinja/views'),
  path.resolve('./nunjucks')
]);

nunjucks.setup(nunjucksConfig, app);

// Add extra filters to nunjucks
nunjucks.ready(function(nj) {
  Object.keys(filters).forEach(function(filterName) {
    nj.addFilter(filterName, filters[filterName]);
  });
});

app.use('/images', express.static(path.resolve('./images')));
app.use('/images', express.static(path.resolve('./node_modules/govuk_frontend_toolkit/images')));
app.use('/fonts', express.static(path.resolve('./node_modules/govuk_template_mustache/assets/stylesheets')));
app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./tests')));
app.use(express.static(path.resolve('./node_modules')));
app.use(express.static(path.resolve('./node_modules/govuk_template_jinja/assets')));

let fakeData = {
  subject: 'test subject',
  asset_path: '/',
  name: 'Fred Smith',
  job: 'Developer',
  jobDescription: 'Description',
  countryOfInterest: ['Country 1', 'Country 2'],
  countryOptions: ['Country 1', 'Country 2', 'United Kingdom', 'Spain', 'France'],
  address: {
    address1: 'Address1',
    address2: 'Address2',
    city: 'City',
    county: 'Berkshire',
    postcode: 'postcode',
    country: 'United Kingdom'
  },
  primaryContact: true,
  hasManager: false,
  accountManager: 'George Clooney',
  advisor: 'Paul',
  advisors: ['George', 'Paul', 'John', 'Ringo'],
  sectors: ['Automotive'],
  SECTOR_OPTIONS: ['Automotive', 'Investment'],
  errors: {
    name: 'You must enter a name',
    dateError: 'You entered an invalid date'
  },
  myDate: '2/12/2016',
  badDate: '34/de/',
  helper: 'John',
  interactionContactId: "A13",
  contacts: {
    "A13": "Fred Smith",
    "B43": "Jane Doe",
    "C51": "Dan Richardson"
  }
};
let fakePostcodeLookup = [{
  address1: "Annexe Blackthorn Cottage",
  address2: "Chawridge Lane",
  city: "Windsor",
  county: "Berkshire",
  postcode: "sl4 4qr"
  },{
  address1: "Blackthorn Cottage",
  address2: "Chawridge Lane",
  city: "Windsor",
  county: "Berkshire",
  postcode: "sl4 4qr"
  }, {
  address1: "Chawridge Manor Farm",
  address2: "Chawridge Lane",
  city: "Windsor",
  county: "Berkshire",
  postcode: "sl4 4qr"
}];

app.get('/', function(req, res) {
  res.render('index', fakeData);
});

app.get('/lookup', function(req, res) {
  let items = ['George', 'Paul', 'John', 'Ringo'];
  let term = req.query.query;

  if (!term || term.length === 0) {
    res.json([]);
    return;
  }

  const matchingItems = items.filter((item) => {
    return item.toLowerCase().indexOf(term.toLowerCase()) !== -1;
  });

  if (matchingItems.length > 0) {
    items = matchingItems.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
    res.json(items);
  } else {
    res.json([]);
  }
});


app.use('/test/js/', express.static(path.resolve('./test/build')));
app.get('/test/:name?', function(req, res) {
  fakeData.testName = req.params.name;
  res.render(req.params.name + 'tests', fakeData);
});
app.get('/postcodelookup/:postcode', (req, res) => {
  res.json(fakePostcodeLookup);
});


app.listen(config.port);