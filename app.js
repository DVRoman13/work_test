const express = require('express');
const bodyParser = require('body-parser');
const { v4 } = require('uuid');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const cities = require('./cities.json');

const vacancies = [
  {
    id: '9052e23a-bb58-4b24-9460-dce5506e1b19',
    name: 'First vacancy in the city',
    city: 'Днепр',
    price: 1000,
    address: '',
    priceComment: 'Paid in USD',
    createdAt: Date.now(),
  },
  {
    id: 'e9cc6af9-0629-4641-a401-5638855a5057',
    name: 'Kyiv vacancy',
    city: 'Киев',
    address: 'Академіка Бутлерова, 1',
    price: { from: 1000, to: 1400 },
    createdAt: Date.now(),
  },
];

app.get('/vacancies', (req, res) => {
  res.json(vacancies);
});

app.get('/cities', (req, res) => {
  const foundCities = req.query.search
    ? cities.filter(city =>
        city.name.toLowerCase().includes(req.query.search.toLowerCase()),
      )
    : cities;

  res.json(foundCities);
});

app.post('/vacancy', (req, res) => {
  if (!req.body || !req.body.vacancy) {
    res.status(500).json({
      error: 'vacancy is not defined',
    });
  }
  const { vacancy } = req.body;

  if (vacancy.name && vacancy.city && vacancy.price) {
    const created = {
      id: v4(),
      ...vacancy,
    };

    vacancies.push(created);

    res.json(created);
  } else {
    res.status(500).json({
      error: 'Some fields are invalid',
    });
  }
});

app.put('/vacancy/:id', (req, res) => {
  if (!req.body || !req.body.vacancy) {
    res.status(500).json({
      error: 'vacancy is not defined',
    });
  }

  const { vacancy } = req.body;
  if (vacancy.name && vacancy.city && vacancy.price) {
    const vacancyIndex = vacancies.findIndex(v => v.id === req.params.id);

    if (vacancyIndex === -1) {
      res
        .status(500)
        .json({ error: `There's no vacancy with id ${req.params.id} ` });
    }

    vacancies.splice(vacancyIndex, 1, {
      ...req.body.vacancy,
      id: req.params.id,
    });

    res.status(200).send();
  } else {
    res.status(500).json({
      error: 'Some fields are invalid',
    });
  }
});

app.delete('/vacancy/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(500).send();
  }

  const index = vacancies.findIndex(v => v.id === req.params.id);

  if (index === -1) {
    return res.status(500).send();
  }

  vacancies.splice(index, 1);

  res.status(200).json({
    status: true,
    msg: 'deleted'
  });;
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
