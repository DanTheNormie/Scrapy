const search_1337x_json = require('./torrents/1337x/search_1337x.task.json')
const torrent_details_1337x_json = require('./torrents/1337x/torrent_details_1337x.task.json')
const search_bingewatch_json = require('./streams/bingewatch/search_bingewatch.task.json')
const search_soaper_json = require('./streams/soaper/search_soaper.task.json')
const search_piratebay_json =  require('./torrents/piratebay/search_piratebay.task.json')
const search_cataz_json = require('./streams/cataz/search_cataz.task.json')
const search_flixhq_json = require('./streams/flixhq/search_flixhq.task.json')
const search_firgirl_json = require('./games/fitgirl/search_fitgirl.task.json')
const search_seven_gamers_json = require('./games/sevengamers/search_sevengames.task.json')
const details_fitgirl_json = require('./games/fitgirl/details_fitgirl_task.json')

const catalog = [
    {
        "domain_name":"1337x",
        "urls":[
            {
                "name":"Search",
                "task":search_1337x_json
            },
            {
                "name":"Details",
                "task":torrent_details_1337x_json
            }
        ]
    },
    {
        "domain_name":"Pirate-Bay",
        "urls":[
            {
                "name":"Search",
                "task":search_piratebay_json
            }
        ]
    },
    {
        "domain_name":"Binge-Watch",
        "urls":[
            {
                "name":"Search",
                "task":search_bingewatch_json
            }
        ]
    },
    {
        "domain_name":"SoaperTv",
        "urls":[
            {
                "name":"Search",
                "task":search_soaper_json
            }
        ]
    },
    {
        "domain_name":"Cataz",
        "urls":[
            {
                "name":"Search",
                "task":search_cataz_json
            }
        ]
    },
    {
        "domain_name":"FlixHQ",
        "urls":[
            {
                "name":"Search",
                "task":search_flixhq_json
            }
        ]
    },
    {
        "domain_name":"Fitgirl",
        "urls":[
            {
                "name":"Search",
                "task":search_firgirl_json
            },
            {
                "name":"Details",
                "task":details_fitgirl_json
            }
        ]
    },
    {
        "domain_name":"SevenGamers",
        "urls":[
            {
                "name":"Search",
                "task":search_seven_gamers_json
            }
        ]
    }
]

const newCatalog = [
    {
        "category_name":"Torrents",
        "domains":[
            {
                "domain_name":"PirateBay",
                
            },
            {
                "domain_name":"1337x"
            }
        ]
    },
    {
        "category_name":"Streams",
        "domains":[
            {
                "domain_name":"BingeWatch"
            },
            {
                "domain_name":"SoaperTv"
            },
            {
                "domain_name":"Cataz"
            },
            {
                "domain_name":"flixhq"
            },
            
        ]
    },
    {
        "catergory_name":"Games",
        "domains":[
            {
                "domain_name":"Fitgirl"
            },
            {
                "domain_name":"Seven Gamers"
            },
            
            
        ]
    }
]

module.exports = catalog

/* [
    {
        "domain_name":"1337x",
        "urls":[
            {
                "name": "Search",
                "task":{
                    "url":"https://1337x.unblockit.rsvp/search/{{search_text}}/{{page_number}}/",
                    "params":{
                        "search_text":{
                            "value":"spiderman",
                            "default":"Avengers",
                            "required":true
                        },
                        "page_number":{
                            "default":1,
                            "required":true
                        }
                    },
                    "selectors":[
                        {
                            "name":"title",
                            "format":"array",
                            "target":"innerText",
                            "selector":"tbody tr .coll-1.name a:nth-child(2)"
                        },
                        {
                            "name":"seeders",
                            "format":"array",
                            "target":"innerText",
                            "selector":"tbody tr .coll-2.seeds"
                        },
                        {
                            "name":"leechers",
                            "format":"array",
                            "target":"innerText",
                            "selector":"tbody tr .coll-3.leeches"
                        },
                        {
                            "name":"size",
                            "format":"array",
                            "target":"innerText",
                            "selector":"tbody tr .coll-4.size"
                        }
                    ],
                    "result":{
                        "format":"array",
                        "data":["title","seeders","leechers","size"]
                    }
                }
            }
        ]
    },
    {
        "domain_name":"Pirate-Bay",
        "urls":[
            {
                "name":"Search",
                "task": {
                    "url": "https://pirate-proxy.mov/search.php?q={{search_text}}",
                    "params": {
                        "search_text": {
                            "default": "spiderman",
                            "required": true
                        }
                    },
                    "selectors": [
                        {
                            "name": "title",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-name.item-title a"
                        },
                        {
                            "name": "seeders",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-seed"
                        },
                        {
                            "name": "leechers",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-leech"
                        },
                        {
                            "name": "size",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-size"
                        },
                        {
                            "name": "uploaded_by",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-user a"
                        },
                        {
                            "name": "uploaded_on",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".list-entry .list-item.item-uploaded label"
                        },
                        {
                            "name": "magnet_link",
                            "format": "array",
                            "target": "href",
                            "selector": ".list-entry .item-icons a"
                        }
                    ],
                    "result": {
                        "format": "array",
                        "data": [
                            "title",
                            "seeders",
                            "leechers",
                            "size",
                            "uploaded_by",
                            "uploaded_on",
                            "magnet_link"
                        ]
                    }
                }
            }
        ]
    },
    {
        "domain_name":"Binge-Watch",
        "urls":[
            {
                "name": "Search",
                "task":{
                    "url": "https://bingewatch.to/search?keyword={{search_text}}",
                    "params": {
                        "search_text": {
                            "default": "spiderman",
                            "required": true
                        }
                    },
                    "selectors": [
                        {
                            "name": "title",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".movie-name"
                        },
                        {
                            "name": "img_url",
                            "format": "array",
                            "target": "src",
                            "selector": ".movie-thumbnail > a > img"
                        },
                        {
                            "name": "details_link",
                            "format": "array",
                            "target": "href",
                            "selector": ".movie-link"
                        },
                        {
                            "name": "info",
                            "format": "array",
                            "target": "innerText",
                            "selector": ".info-split"
                        }
                    ],
                    "result": {
                        "format": "array",
                        "data": [
                            "title",
                            "img_url",
                            "info",
                            "details_link"
                        ]
                    }
                }
            }
        ]
    }
] */