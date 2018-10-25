
const ask = require('ask-sdk');


module.exports = {
	bodyTemplateMaker: bodyTemplateMaker,
	homePage: homePageTemplateMaker
}

function bodyTemplateMaker(pBodyTemplateType, pHandlerInput, pImg, pTitle, pText1, pText2, pText3, pOutputSpeech, pReprompt, pHint, pBackgroundIMG, pEndSession) {
    const response = pHandlerInput.responseBuilder;
    const image = imageMaker("", pImg);
    const richText = richTextMaker(pText1, pText2, pText3);
    const backgroundImage = imageMaker("", pBackgroundIMG);
    const title = pTitle;

    response.addRenderTemplateDirective({
        type: pBodyTemplateType,
        backButton: 'visible',
        image,
        backgroundImage,
        title,
        textContent: richText,
    });

    if (pHint)
        response.addHintDirective(pHint);

    if (pOutputSpeech)
        response.speak(pOutputSpeech);

    if (pReprompt)
        response.reprompt(pReprompt);

    if (pEndSession)
        response.withShouldEndSession(pEndSession);
    console.log("body template made.");
    return response.getResponse();
}

function homePageTemplateMaker(pListTemplateType, pHandlerInput, pTitle, pOutputSpeech) {
    const response = pHandlerInput.responseBuilder;
    const bgImg = 'https://st.depositphotos.com/1202217/4508/i/950/depositphotos_45087681-stock-photo-grey-concrete-texture-wall-bright.jpg';
    const backgroundImage = imageMaker("", bgImg);
    var itemList = [];
    var title = pTitle;

    const nutritionImg = 'https://cdn3.iconfinder.com/data/icons/health-care-and-medical-3/64/blue-01-512.png';
    itemList.push({
    	"token": 'nutrition',
        "textContent": new ask.PlainTextContentHelper().withPrimaryText('Nutrition Plan').getTextContent(),
        "image": imageMaker("", nutritionImg)
    });

    const scheduleImg = 'https://cdn4.iconfinder.com/data/icons/time-date-management/512/schedule_clock-512.png';
    itemList.push({
    	"token": 'schedule',
        "textContent": new ask.PlainTextContentHelper().withPrimaryText('Find a Class').getTextContent(),
        "image": imageMaker("", scheduleImg)
    });

    const workoutImg = 'https://cdn1.iconfinder.com/data/icons/medical-health-care-blue-series-set-4/64/b-65-512.png';
    itemList.push({
    	"token": 'workout',
        "textContent": new ask.PlainTextContentHelper().withPrimaryText('Workouts').getTextContent(),
        "image": imageMaker("", workoutImg)
    });

    const referFriendImg = 'https://cdn0.iconfinder.com/data/icons/admin-panel-glyph-black/2048/608_-_Referrals-512.png';
    itemList.push({
    	"token": 'referral',
        "textContent": new ask.PlainTextContentHelper().withPrimaryText('Refer a Friend').getTextContent(),
        "image": imageMaker("", referFriendImg)
    });

    if (pOutputSpeech) {
        response.speak(pOutputSpeech);
    }

    response.addRenderTemplateDirective({
        type: pListTemplateType,
        backButton: 'hidden',
        backgroundImage,
        title,
        listItems: itemList,
    });

    return response.getResponse();
}

function imageMaker(pDesc, pSource) {
    const myImage = new ask.ImageHelper()
        .withDescription(pDesc)
        .addImageInstance(pSource)
        .getImage();

    return myImage;
}

function richTextMaker(pPrimaryText, pSecondaryText, pTertiaryText) {
    const myTextContent = new ask.RichTextContentHelper();

    if (pPrimaryText)
        myTextContent.withPrimaryText(pPrimaryText);

    if (pSecondaryText)
        myTextContent.withSecondaryText(pSecondaryText);

    if (pTertiaryText)
        myTextContent.withTertiaryText(pTertiaryText);

    return myTextContent.getTextContent();
}
