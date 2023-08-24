function main()
{
    // References to required DOM objects

    // Sign Up Form
    const signUpForm = document.querySelector(".real-form > form");

    // Link that leads to success page
    const successLink = document.querySelector("a#hidden-link");

    // Sign Up Button
    const signUpBtn = document.querySelector("button#sign-up-btn");

    // Form Footer
    const formFooter = document.querySelector("footer.form-footer");

    // Input elements with their respective regexes attached
    const inputElements = {
        firstName       : {
            element: document.querySelector("input#first-name"),
            regex:   null
        },
        lastName        : {
            element: document.querySelector("input#last-name"),
            regex: null
        },
        email           : {
            element: document.querySelector("input#email"),
            regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        },
        phoneNumber     : {
            element: document.querySelector("input#phone-number"),
            regex: /^\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/
        },
        password        : {
            element: document.querySelector("input#password"),
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        },
        confirmPassword : {
            element: document.querySelector("input#confirm-password"),
            regex:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        }
    };

    // Save the border color of input elements as constants
    const inputBorderColors = {
        defaultInputBorderColor   : "#DBD8E3",
        focusInputBorderColor     : "#008080",
        invalidInputBorderColor   : "#800020"
    };

    // Submit the form when the sign up button is clicked
    signUpBtn.addEventListener("click", () => handleFormSubmition(successLink, signUpForm, formFooter, inputElements));

    // Don't allow the user to copy/paste text to input elements of type password
    const inputPasswordElements = [inputElements.password.element, inputElements.confirmPassword.element];
    inputPasswordElements.forEach(inputPasswordElement => {
        inputPasswordElement.addEventListener("copy", e => e.preventDefault());
        inputPasswordElement.addEventListener("paste", e => e.preventDefault());
    });

    // Grab the input elements that have an associated regex
    const inputsToCheckObjs = Object.keys(inputElements).map(key => inputElements[key]).filter(inputObj => inputObj.regex !== null);
    inputsToCheckObjs.forEach((inputToCheckObj) => {

        // Grab each element and regex individually
        const { element, regex } = inputToCheckObj;

        // Associate an event handler for the input event
        element.addEventListener("input", () => handleCheckedInput(element, regex, inputBorderColors));

        // Handle what happens when the element is blur
        element.addEventListener("blur", () => handleCheckedInputOnBlur(element, regex, inputBorderColors));
    });

    // Set styles for all input elements
    for (let key in inputElements)
    {
        // Always check for existing properties
        if (inputElements.hasOwnProperty(key))
        {
            const currentElement = inputElements[key].element;
            
            // Always change the border color when the element is on focus (Gained focus)
            currentElement.addEventListener("focus",() => {
                currentElement.style.borderColor = inputBorderColors.focusInputBorderColor;
            });

            // Make sure the current element has no regex associated to it
            if (inputElements[key].regex === null)
            {
                currentElement.addEventListener("blur", () => {
                    currentElement.style.borderColor = inputBorderColors.defaultInputBorderColor;
                });
            }
        }
    }

}

function handleFormSubmition(successLink, signUpForm, formFooter, inputElements)
{
    // Control what happens when the Sign Up button is clicked

    // First check that all fields have the right info
    const inputsValidInfoStatus = [];

    for (let key in inputElements)
    {
        const { element, regex } = inputElements[key];

        const currentValue = element.value;
        let isValueValid = null;

        if (regex == null)
        {
            isValueValid = true;
        }

        else
        {
            isValueValid = regex.test(currentValue);
        }

        inputsValidInfoStatus.push(isValueValid);
    }

    // Get if all input values have the valid info
    const allInputValuesAreValid = inputsValidInfoStatus.every(validInfoStatus => validInfoStatus === true);

    if (allInputValuesAreValid)
    {
        removeInvalidFeedbackForFormSubmission(formFooter);
        signUpForm.submit();
        successLink.click();
    }

    else
    {
        generateInvalidFeedbackForFormSubmission(formFooter);
    }

}

function generateInvalidFeedbackForFormSubmission(formFooter)
{
    // Grab the first child to do so
    const formFooterFirstChild = formFooter.children[0];

    // Only add message if the first child of the form footer is a button element
    if (formFooterFirstChild.tagName === "BUTTON")
    {
        // Generate a paragraph element
        const messageP = document.createElement("p");

        // Generate a text node to show
        const messageContent = document.createTextNode("Error: Information is incorrect and/or incomplete");

        // Add the text node to the paragraph
        messageP.appendChild(messageContent);

        // Add class to style the paragraph element
        messageP.classList.add("invalid-submit-feedback");

        // Add the paragraph element to the beginning of the parent of the form

        formFooter.insertBefore(messageP, formFooterFirstChild);
    }

}

function removeInvalidFeedbackForFormSubmission(formFooter)
{
    // Grab the first child of the form footer
    const formFooterFirstChild = formFooter.children[0];

    // If the tag name is not button then remove it
    if (formFooterFirstChild.tagName !== "BUTTON")
    {
        formFooter.removeChild(formFooterFirstChild);
    }

}

function handleCheckedInput(inputElement, regexToValidate, borderColors)
{
    /* Handle Styles and Feedback of Input Elements that Need Checks */

    // Grab the current value
    const currentValue = inputElement.value;
    
    // Check the value of the input element is greater than 1
    if (currentValue.length > 0)
    {
        // Get if the current value follows the regex pattern
        const isValidValue = regexToValidate.test(currentValue);

        // Handle what happens when the input value does not match the regex pattern
        if (isValidValue)
        {
            inputElement.style.borderColor = borderColors.focusInputBorderColor;

            // If the parent node of the input has more than 2 children, preserve the first 2 and remove the others
            removeFeedbackForInvalid(inputElement.parentNode);
        }

        else
        {
            // Change the border color of the input element to the invalid color
            inputElement.style.borderColor = borderColors.invalidInputBorderColor;

            // Generate feedback
            generateFeedbackForInvalid(inputElement.parentNode, inputElement.type, borderColors);
        }
    }

    else
    {
        inputElement.style.borderColor = borderColors.defaultInputBorderColor;
        removeFeedbackForInvalid(inputElement.parentNode);
    }

}

function handleCheckedInputOnBlur(inputElement, regexToValidate, borderColors)
{
    /* Handle Border colors of input element when it's on blur */

    // Grab the current value of the input element
    const currentValue = inputElement.value;

    if (currentValue.length > 1)
    {
        // Grab if it's valid according to the regex
        const isValidValue = regexToValidate.test(currentValue);

        if (isValidValue)
        {
            // If regex is valid then then border color should be the default one
            inputElement.style.borderColor = borderColors.defaultInputBorderColor;

        }

        else
        {
            inputElement.style.borderColor = borderColors.invalidInputBorderColor;
        }
    }

    else
    {
        inputElement.style.borderColor = borderColors.defaultInputBorderColor;
        removeFeedbackForInvalid(inputElement.parentNode);
    }
}

function generateFeedbackForInvalid(parentInputElement, inputType)
{
    if (parentInputElement.childElementCount <= 2)
    {
            // Create a new p element
        const messageP = document.createElement("p");

        // Create a text node with the message to add to it
        const messageContent = document.createTextNode(getInvalidMessage(inputType));

        // Add CSS class of invalid-feedback to the p element
        messageP.classList.add("invalid-feedback");

        // Append the text node to the paragraph
        messageP.appendChild(messageContent);

        // Append the paragraph to the parent of the input element
        parentInputElement.appendChild(messageP);
    }
}

function removeFeedbackForInvalid(parentInputElement)
{
    /* If there is a feedback for an invalid element remove it */
    if (parentInputElement.childElementCount > 2)
    {
        const inputParentChildren = parentInputElement.children;

        for (let i = inputParentChildren.length - 1; i >= 2; i--)
        {
            parentInputElement.removeChild(inputParentChildren[i]);
        }
    }
}

function getInvalidMessage(inputType)
{
    let message = "";

    switch (inputType)
    {

        case "email":
            message = "Email must follow pattern: aa@bb.cc";
            break;
        
        case "password":
            message = "At least 8 chars, 1 upper, 1 lower, and 1 digit";
            break;
        
        case "tel":
            message = "Only US phone numbers allowed";
            break;
        
        default:
            message = "Unknown input type";
    }

    return message;
}

document.addEventListener("DOMContentLoaded", main);