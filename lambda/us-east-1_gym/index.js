/*
By Qiheng Chen. 2018.
*/

const ask = require('ask-sdk');
const display = require('./display.js');
//const schedule = require('./schedule.js');

// ========== Constants ========== //
const WELCOME_MESSAGE = 'Welcome to the UFC gym. You can check class schedule, and access services only available to our members!';
const FALLBACK_MESSAGE = 'I\'m sorry UFC gym isn\'t smart enough to understand it. Say help to see what I can do!';
const ERR_MESSAGE = 'Sorry I don\'t understand what you said. Please say again.';
const ERR_REPROMPT = 'Sorry just try one more time.';
const HELP_MESSAGE = 'I can check class schedule and set workout remainder for you. Try check yoga schedule on Tuesday.';
const HOURS = 'We are open from 7am to 7pm, Monday through Sunday.';
const DISCOUNT = 'Congratulations! You can renew your membership for a 20% discount!';

// ========== Interceptors ========== //
const RequestLog = {
    process(handlerInput) {
        //console.log("REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope));
        return;
    }
};


// ========== Handlers, Custom Intents ========== //

const TestIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Test';
    },
    
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const testType = request.intent.slots.test_type.value;
        if (testType === 'display') {
            const pImg = 'https://cdn2.iconfinder.com/data/icons/boxing/500/Boxing_17-512.png';
            const bgImg = 'https://static1.squarespace.com/static/57d9894903596ed9a1cc1de1/57e3931bff7c50cf34406d56/59233a7bb8a79b17f5babdfe/1495484392131/boxing-gloves-wallpaper-high-quality-resolution.jpg?format=2500w';

            //return a display
            //bodyTemplateMaker(pBodyTemplateType, pHandlerInput, pImg, pTitle, pText1, pText2, pText3, pOutputSpeech, pReprompt, pHint, pBackgroundIMG, pEndSession)
            return display.bodyTemplateMaker('BodyTemplate2', handlerInput, pImg, 'pTitle', 'pText1', 'pText2', 'pText3', '', '', 'Hint goes here', bgImg, false);
        }
        return handleUnknown(handlerInput);
    }
};

const CheckScheduleHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && (request.intent.name === 'Check_Schedule' 
            || request.dialogState === 'COMPLETED');
    },
    
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        //must pick up the canonical value, not the actual value.
        if (request.dialogState != 'COMPLETED') {
            return handlerInput.responseBuilder
            .addDelegateDirective(request.intent)
            .getResponse();
        }
        
        //const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);

        let className = request.intent.slots.class.value; //.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let dayOfWeek = request.intent.slots.date.value.toLowerCase(); //.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        console.log('CLASS + DAY: ' + JSON.stringify(className) + '   ' + JSON.stringify(dayOfWeek));

        return dayAndClassResponseBuilder(className, dayOfWeek, handlerInput);
    },
};

const BookClassHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && (request.intent.name === 'Book_Class'
            || (request.intent.name === 'AMAZON.YesIntent' && handlerInput.attributesManager.getSessionAttributes().bookingClass));
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak('You are booked for the class. See you there.')
        .getResponse();
    },
};

const ListClassHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'List_Class';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak('We have yoga, cycling, boxing, and jiu jitsu class.')
        .getResponse();
    },
};


const CheckHoursHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Check_Hours';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
        .speak(HOURS)
        .getResponse();
    },
};

const CheckDiscountHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Check_Discount';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const pImg = 'https://cdn2.iconfinder.com/data/icons/boxing/500/Boxing_17-512.png';
        const bgImg = 'https://static1.squarespace.com/static/57d9894903596ed9a1cc1de1/57e3931bff7c50cf34406d56/59233a7bb8a79b17f5babdfe/1495484392131/boxing-gloves-wallpaper-high-quality-resolution.jpg?format=2500w';

        //return a display
        //bodyTemplateMaker(pBodyTemplateType, pHandlerInput, pImg, pTitle, pText1, pText2, pText3, pOutputSpeech, pReprompt, pHint, pBackgroundIMG, pEndSession)
        return display.bodyTemplateMaker('BodyTemplate3', handlerInput, pImg, 'Cycling Class', 'Monday 6-8pm', 'Michael Jordan', '', 'output speech', 'reprompt text', 'book this class', bgImg, false);

        //return handlerInput.responseBuilder
        //.speak(DISCOUNT)
        //.getResponse();
    },
};

// ========== Handlers, Built-in Intents ========== //

const PreviousIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.PreviousIntent';
    },
    handle(handlerInput) {
        //return a response
        return handleUnknown(handlerInput);
    },
};

const NextIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.NextIntent';
    },
    handle(handlerInput) {

        return handleUnknown(handlerInput);
    },
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        //homePageTemplateMaker(pListTemplateType, pHandlerInput, pTitle, pOutputSpeech)
        return display.homePage('ListTemplate2', handlerInput, "Welcome", WELCOME_MESSAGE);
        //return handlerInput.responseBuilder
        //.speak(WELCOME_MESSAGE)
        //.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;  
    },
    handle(handlerInput, error) {
        console.log('Error handled: ' + error.message);
        return handlerInput.responseBuilder
            .speak(ERR_MESSAGE)
            .reprompt(ERR_REPROMPT)
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_MESSAGE)
        .getResponse();
    },
};

const FallbackHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.isAskingForAnythingElse = true;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt('anything else?')
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent'
            || (request.intent.name === 'AMAZON.NoIntent' && handlerInput.attributesManager.getSessionAttributes().isAskingForAnythingElse));
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak('Qiao, don\'t be shy to say hi again!')
        .getResponse();
    },
};


// ========== Helper Functions ========== //

function getSlotValues(slots) {
    const slotValues = {};
    console.log('The filled slots: ${JSON.stringify(slots)}');

    Object.keys(slots).forEach((item) => {
        const slotType = slots[item].name;
        if (slots[item] && slots[item].resolutions && slots[item].resolutions.resolutionsPerAuthority[0]
            && slots[item].resolutions.resolutionsPerAuthority[0].status &&
            slots[item].resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_MATCH') {
            
            slotValues[slotType] = {
                actual: slots[item].value,
                resolved: slots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                isValidated: true,
            };
        } else {
            slotValues[slotType] = {
                actual: slots[item].value,
                resolved: slots[item].value,
                isValidated: false,
            };
        }
    }, this);
    return slotValues;
}

function dayAndClassResponseBuilder(className, dayOfWeek, handlerInput) {
    //console.log('CLASS + DAY: ' + className + '  ' + dayOfWeek);

    var classes;

    switch (className) {
    case 'yoga':
        classes = schedule[dayOfWeek]['A'];

        if (classes) {
            let speechText = 'Yoga class on ' + dayOfWeek + ': ';
            return speechOutputHelper(speechText, classes, handlerInput);
        } else {
            return cannotFindClassHelper(handlerInput);
        }

    case 'cycling':
        classes = schedule[dayOfWeek]['B'];

        if (classes) {
            let speechText = 'Cycling class on ' + dayOfWeek + ': ';
            return speechOutputHelper(speechText, classes, handlerInput);
        } else {
            return cannotFindClassHelper(handlerInput);
        }

    case 'boxing':
        classes = schedule[dayOfWeek]['C'];

        if (classes) {
            let speechText = 'Boxing class on ' + dayOfWeek + ': ';
            return speechOutputHelper(speechText, classes, handlerInput);
        } else {
            return cannotFindClassHelper(handlerInput);
        }

    case 'jiu jitsu':
        classes = schedule[dayOfWeek]['D'];
        
        if (classes) {
            let speechText = 'Jiu jitsu class on ' + dayOfWeek + ': ';
            return speechOutputHelper(speechText, classes, handlerInput);
        } else {
            return cannotFindClassHelper(handlerInput);
        }

    default:
        return handlerInput.responseBuilder
        .speak("Please tell me the class name again")
        .reprompt("Please tell me the class name again")
        .getResponse();
    }
}

function speechOutputHelper(speechText, classes, handlerInput) {
    let session;
    let i;

    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.bookingClass = true;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    for (i in classes) {
        session = classes[i];
        speechText = speechText.concat(times[session[1]], ' by instructor ', instructors[session[0]], '. ');
    }

    return handlerInput.responseBuilder
    .speak(speechText)
    .reprompt("Do you want to book the class?")
    .withSimpleCard("Class Info", speechText)
    .getResponse();
}

function cannotFindClassHelper(handlerInput) {
    return handlerInput.responseBuilder
    .speak('Sorry, I didn\'t find any class.')
    .reprompt('Try another class or another day?') //TODO: suggest a class. don't end session. 
    .getResponse();
}

function handleUnknown(handlerInput) {
    //For when Alexa doesn't understand the user
    let speechOutput = 'I am sorry. I did not quite get that one. Could you try again?';
    let reprompt = 'Could you try again?';

    const response = handlerInput.responseBuilder;

    //saveLastThingSaid(pHandlerInput, speechOutput);

    return response.speak(speechOutput).reprompt(reprompt).getResponse();
}

// ========== Hardcoded Data ========== //

const schedule = {
    'monday': {'B': [['l','x']], 'D': [['m','y'], ['n','z']]},
    'tuesday': {'A': [['m', 'y']], 'C': [['n','z']]},
    'wednesday': {'A': [['m','x']], 'B': [['m','y']], 'C': [['m','z']]},
    'yhursday': {'A': [['l','x']], 'B': [['m','y']]},
    'friday': {'C': [['n','x']], 'D': [['n','z']]},
    'saturday': {'B':[['l','x']], 'D': [['m','y']], 'A':[['n','z']]},
    'sunday': {'B': [['m','y']]},
};

const instructors = {
    'l': 'Lauren Thompson',
    'm': 'Chris Lee',
    'n': 'Kevin Armstrong',
};

const times = {
    'x': 'from 10 am to 11:30 am',
    'y': 'from 3 pm to 4 pm',
    'z': 'from 6 pm to 8 pm',
};

// ========== Lambda Handler ========== //

const skillBuilder = ask.SkillBuilders.custom();

exports.handler = skillBuilder.addRequestHandlers(
    TestIntentHandler,
    PreviousIntentHandler,
    NextIntentHandler,
    LaunchRequestHandler,
    BookClassHandler,
    ListClassHandler,
    CheckScheduleHandler,
    CheckHoursHandler,
    CheckDiscountHandler,
    HelpHandler,
    FallbackHandler,
    ExitHandler,
    SessionEndedRequestHandler)
    .addRequestInterceptors(RequestLog)
    .addErrorHandlers(ErrorHandler)
    .lambda();



