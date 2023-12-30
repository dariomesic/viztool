import $ from "jquery";

function checkCondition(sign, checkedValue, actualValue, betweenValues) {
    switch (sign) {
        case 'Equals':
            return actualValue == checkedValue;
        case 'More Than':
            return actualValue > checkedValue;
        case 'Less Than':
            return actualValue < checkedValue;
        case 'Between':
            return actualValue > +betweenValues[0] && actualValue < +betweenValues[1];
    }
}

export function setConditionalFormatting(htmlElements, conditionalFormattingList) {
    if (!conditionalFormattingList) {
        return;
    }
    htmlElements.each(function () {
        let element = $(this)[0];
        for (const conditionalFormat of conditionalFormattingList) {
            if (element.innerHTML && checkCondition(conditionalFormat.sign, +conditionalFormat.value, +element.innerHTML, conditionalFormat.between)) {
                element.style.color = conditionalFormat.colorText;
                element.style.background = conditionalFormat.colorCell;
                element.style.fontFamily = conditionalFormat.format;
                element.style.fontSize = conditionalFormat.fontSize;
                element.style.fontWeight = conditionalFormat.bold && 'bold';
                element.style.fontStyle = conditionalFormat.italic && 'italic';
                element.style.textDecoration = conditionalFormat.underline && 'underline';
            }
        }
    });
}