### Test task
Needs to implement couple screens, primarily it's vacancy list and basic vacancy editor.
It's required to have client-side validation ([designs attached](https://www.figma.com/file/niNe49pH6z3TzlXGsnTKd7/)) and basic adaptive design for mobile.
There are no detailed requirements like amount of pixels for margins, so we don't expect you to make 100% match, but try to make it nice ;)
Editor form - most of the fields are just plain text but city field should have autocomplete (there's endpoint for cities).

Format of data and field names are described in Server API below.
You pick libs and tools for this task, but you'll need to defend you choice.

### Requirements
1. Node

### Start Server
There's simple express server, which holds data in memory, so you could start fresh at any point of time.

1. npm install
2. npm start

### Server API
Base url: `http://localhost:3000`

#### Get all vacancies `GET /vacancies`

Response:
```
[
    {
        "id": "9052e23a-bb58-4b24-9460-dce5506e1b19",
        "name": "First vacancy in the city",
        "city": "39",
        "price": 1000,
        "priceComment": "Paid in USD",
        "createdAt": 1613918028762
    },
    {
        "id": "e9cc6af9-0629-4641-a401-5638855a5057",
        "name": "Kyiv vacancy",
        "city": "34",
        "price": {
            "from": 1000,
            "to": 1400
        },
        "createdAt": 1613918028762
    }
]
```


#### Create vacancy `POST /vacancy`

Example body:
```
{
  "name": "New Vacancy",
  "city": "34",
  "price": 1000,
}
```

Response: created vacancy

#### Update vacancy `PUT /vacancy/:id`

Example body:
```
{
  "name": "Updated Vacancy",
  "city": "34",
  "price": 1200,
}
```

#### Delete vacancy `DELETE /vacancy/:id`

#### Get all cities `GET /cities`

Returns all cities
```
[
	{"id":"33","name":"Винница"},
	{"id":"34","name":"Днепр"},
	{"id":"35","name":"Донецк"},
	{"id":"36","name":"Житомир"},
  ...
]
```

#### Search cities `GET /cities?search=Днепр`

Returns matched cities:
```
[
  { id: '34', name: 'Днепр' },
];
```