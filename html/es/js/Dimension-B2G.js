/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

importScript("Dimension.js");
importScript("qb/ESQuery.js");

if (!Mozilla) var Mozilla = {"name": "Mozilla", "edges": []};

Dimension.addEdges(true, Mozilla, [
	{"name": "B2G",
		"esfilter": {"or": [
			{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}},
			{"term": {"product": "firefox os"}}
		]},
		"edges": [
			{"name": "Age", "index": "bugs", "isFacet": true, "partitions": [
				{"name": "Old", "style": {"color": "red"}, "esfilter": {"range": {"modified_ts": {"lt": Date.eod().add("-4day").getMilli()}}}},
				{"name": "Close", "style": {"color": "orange"}, "esfilter": {"range": {"modified_ts": {"lt": Date.eod().add("-3day").getMilli()}}}},
				{"name": "Young", "style": {"color": "green"}, "esfilter": {"range": {"modified_ts": {"lt": Date.eod().getMilli()}}}}
			]},

			{"name":"Team", "isFacet": true, "partitions":[
				{"name":"Performance",
					"esfilter":{"term":{"keyword":"perf"}}
				},
				{"name":"System Front-End", "esfilter":{"and":[
					{"not":{"term":{"keyword":"perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms":{"component":[
						"gaia::browser",
						"gaia::everything.me",
						"gaia::first time experience",
						"gaia::homescreen",
						"gaia::search",
						"gaia::system",
						"gaia::system::browser chrome"
					]}}
				]}},
				{"name": "Productivity", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"gaia::e-mail",
						"gaia::clock",
						"gaia::calculator",
						"gaia::calendar",
						"gaia::notes"
					]}}
				]}},
				{"name": "Media", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"gaia::camera",
						"gaia::fmradio",
						"gaia::gallery",
						"gaia::music",
						"gaia::video"
					]}}
				]}},
				{"name": "RIL", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"ril",
						"nfc",
						"wifi",
						"rtsp"
					]}}
				]}},
				{"name": "System Platform", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"gaia::settings",
						"gaia::system::window mgmt",
						"gaia::keyboard",
						"gaia::system::input mgmt",
						"gaia::system::lockscreen"
					]}}
				]}},
				{"name": "Multi-media Platform", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"video/audio: recording",
						"video/audio",
						"webrtc",
						"webrtc: video/audio"
					]}}
				]}},
				{"name": "Comms", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"dom: contacts",
						"gaia::contacts",
						"gaia::cost control",
						"gaia::dialer",
						"gaia::sms"
					]}}
				]}},
				{"name": "Devices", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"audiochannel",
						"bluetooth",
						"hardware",
						"vendcom"
					]}}
				]}},
				{"name": "All Others", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"not": {"terms": {"component": [
						//AN UNFORTUNATE LIST OF EVERYTHING, SHOULD BE AUTO-GENERATED, BUT I NEED A EQUATION SIMPLIFIER
						"gaia::browser",
						"gaia::everything.me",
						"gaia::first time experience",
						"gaia::homescreen",
						"gaia::search",
						"gaia::system",
						"gaia::system::browser chrome",
						"gaia::e-mail",
						"gaia::clock",
						"gaia::calculator",
						"gaia::calendar",
						"gaia::notes",
						"gaia::camera",
						"gaia::fmradio",
						"gaia::gallery",
						"gaia::music",
						"gaia::video",
						"ril",
						"nfc",
						"wifi",
						"rtsp",
						"gaia::settings",
						"gaia::system::window mgmt",
						"gaia::keyboard",
						"gaia::system::input mgmt",
						"gaia::system::lockscreen",
						"video/audio: recording",
						"video/audio",
						"webrtc",
						"webrtc: video/audio",
						"dom: contacts",
						"gaia::contacts",
						"gaia::cost control",
						"gaia::dialer",
						"gaia::sms",
						"audiochannel",
						"bluetooth",
						"hardware",
						"vendcom"
					]}}}
				]}}
			]},

			{"name": "State", "index": "bugs", "isFacet": true,
				"partitions": [
					{"name": "Open - Unassigned", "esfilter": {"and": [
						{"term": {"assigned_to": "nobody@mozilla.org"}},
						{"not": {"term": {"keywords": "regression"}}},
						{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
					]}},
					{"name": "Open - Assigned", "esfilter": {"and": [
						{"not": {"term": {"assigned_to": "nobody@mozilla.org"}}},
						{"not": {"term": {"keywords": "regression"}}},
						{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
					]}},
					{"name": "Nominated", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3?", "1.4?", "1.3t?", "1.5?"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Blocker", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Regression", "esfilter": {"term": {"keywords": "regression"}}}
				]},

			{"name": "Project", "index": "bugs", "isFacet": true, "partitions": [
				{"name": "1.3", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3+", "1.3?"]}}},
				{"name": "1.3t", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3t+", "1.3t?"]}}},
				{"name": "1.4", "esfilter": {"terms": {"cf_blocking_b2g": ["1.4+", "1.4?"]}}},
				{"name": "1.5", "esfilter": {"terms": {"cf_blocking_b2g": ["1.5+", "1.5?"]}}},
				{"name": "Untargeted", "esfilter": {"and": [
					{"term": {"product": "firefox os"}},
					{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
				]}}

//                {"name":"KOI", "esfilter":{"or":[
////                    {"and":[
////                        {"exists":{"field":"target_milestone"}},
////                        {"prefix":{"target_milestone":"1.2"}},
////                        {"not":{"term":{"product": "instantbird"}}},
////                        {"not":{"term":{"product": "chat core"}}}
////                    ]},
//                    {"terms":{"cf_blocking_b2g":["koi+", "koi?"]}}
//                ]}},
//                {"name":"LEO", "esfilter":{"terms":{"cf_blocking_b2g":["leo+", "leo?"]}}},
//                {"name":"HD", "esfilter":{"terms":{"cf_blocking_b2g":["hd+", "hd?"]}}}
			]}
		]
	}
]);

