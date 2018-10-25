
module.exports = {
	schedule: {
	    'monday': {'B': [['l','x']], 'D': [['m','y'], ['n','z']]},
	    'tuesday': {'A': [['m', 'y']], 'C': [['n','z']]},
	    'wednesday': {'A': [['m','x']], 'B': [['m','y']], 'C': [['m','z']]},
	    'yhursday': {'A': [['l','x']], 'B': [['m','y']]},
	    'friday': {'C': [['n','x']], 'D': [['n','z']]},
	    'saturday': {'B':[['l','x']], 'D': [['m','y']], 'A':[['n','z']]},
	    'sunday': {'B': [['m','y']]},
	},
	instructors: {
	    'l': 'Lauren Thompson',
	    'm': 'Michael Jordan',
	    'n': 'Noah Smith',
	},
	times: {
	    'x': 'from 10 am to 11:30 am',
	    'y': 'from 3 pm to 4 pm',
	    'z': 'from 6 pm to 8 pm',
	},
};
