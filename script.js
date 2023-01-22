let uiCount = 1;
const resultsDiv = document.getElementById("microcopy-results");

let apiKey;

// Check if the API key is stored in local storage
if (localStorage.getItem("apiKey")) {
  apiKey = localStorage.getItem("apiKey");
} else {
  // Ask the user for their API key
  apiKey = prompt("Please enter your API key:");
  // Store the API key in local storage
  localStorage.setItem("apiKey", apiKey);
}

function updateAPIKey() {
    // Ask the user for the new API key
    const newAPIKey = prompt("Please enter your new API key:");
    if (newAPIKey) {
        // Update the apiKey variable
        apiKey = newAPIKey;
        // Update the value in local storage
        localStorage.setItem("apiKey", apiKey);
    }
  }

document.getElementById("update-api-key").addEventListener("click", updateAPIKey);

// Adding new UI Element inputs
function addUI() {
  uiCount++;
  const container = document.querySelector('.ui-element-container');
  const newUI = `
    <div class="ui-element">
        <div class="divider"></div>
        <h3>UI Element ${uiCount}</h3>
        <label for="type-of-ui-${uiCount}">Type of UI element for the microcopy<div class="astrix">*</div></label>
        <input type="text" id="type-of-ui-${uiCount}" name="type-of-ui-${uiCount}" placeholder="E.g. Heading, Body text, Button, etc" required>

        <label for="default-microcopy-${uiCount}">Provide your version of the microcopy <div class="astrix">*</div></label>
        <input type="text" id="default-microcopy-${uiCount}" name="default-microcopy-${uiCount}" placeholder="Put in your base microcopy for the element" required>
        
        <label for="desirable-structure-${uiCount}">Provide desirable microcopy structure<div class="optional">(optional)</div> </label>
        <input type="text" id="desirable-structure-${uiCount}" name="desirable-structure-${uiCount}" placeholder="Might be like:'Hello, [Username]! Text.'">
        
        <label for="max-characters-${uiCount}">Max Characters <div class="astrix">*</div></label>
        <input type="number" id="max-characters-${uiCount}" value="280" name="max-characters-${uiCount}" required>
    </div>
  `;
    container.insertAdjacentHTML('beforeend', newUI); 
    // scroll to the new element
    let lastUIElement = document.getElementsByClassName('ui-element');
    lastUIElement[lastUIElement.length-1].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generatePrompt(toneOfVoice, context, generalComponent, purpose, uiElements) {
    let prompt = `Please generate high-quality microcopy for the following UI elements:`;
    uiElements.forEach((element) => {
      prompt += ` "${element.typeOfUI}"`;
    });
    prompt += ` that are displayed in the "${generalComponent}" as part of the "${context}" user flow. The microcopy should have the following tone of voice: "${toneOfVoice}" and should be based on the following microcopy suggestions:`;
    uiElements.forEach((element) => {
      prompt += `\nFor "${element.typeOfUI}": "${element.defaultMicrocopy}",`;
      if (element.desirableStructure) {
        prompt += ` desired structure: "${element.desirableStructure}",`;
      }
      prompt += ` max characters: "${element.maxCharacters}"`;
    });
    prompt += `\nThe purpose of the microcopy is "${purpose}". The final microcopy result should be generated according to the best UX copy practices.`;
    return prompt;
  }

function storeInput() {
    event.preventDefault();
    
    const form = document.getElementById('microcopy-form');

    let isFormValid = true;
    let firstInvalidField = null;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.border = "1px solid red";
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
            isFormValid = false;
        } else {
            field.style.border = "1px solid #ccc";
        }
    });

    if (isFormValid) {
        const toneOfVoice = form.elements['tone-of-voice'].value;
        const context = form.elements['context'].value;
        const generalComponent = form.elements['general-component'].value;
        const purpose = form.elements['purpose'].value;
        const uiElements = [];
    
      for (let i = 1; i <= uiCount; i++) {
        const typeOfUI = form.elements[`type-of-ui-${i}`].value;
        const defaultMicrocopy = form.elements[`default-microcopy-${i}`].value;
        const desirableStructure = form.elements[`desirable-structure-${i}`].value;
        const maxCharacters = form.elements[`max-characters-${i}`].value;
        uiElements.push({ typeOfUI, defaultMicrocopy, desirableStructure, maxCharacters });
      }
    
    //   sendPromptToChatGPT(generatePrompt(toneOfVoice, context, generalComponent, purpose, uiElements)); 
      displayMicrocopy(generatePrompt(toneOfVoice, context, generalComponent, purpose, uiElements));
          // scroll to the result
          resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }
}

async function sendPromptToChatGPT(prompt) {
    console.log('async: ' + prompt);
    try {
    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 2048,
        temperature: 0.7
      })
      
    });
    if (!response.ok) {
        // throw new Error(response.statusText);
        // return new Error(response.statusText)
        }
        const json = await response.json();
        return json.choices[0].text;
        } catch (error) {
        return error;
        }
  };

let copyAttempts = 1; // versions counter

async function displayMicrocopy(prompt) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.style.display = "block";
    let resultsDiv = document.getElementById("results");
    let loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "flex";
    const microcopy = await sendPromptToChatGPT(prompt);
    let copyResult = `
    <div class="result-version">version ${copyAttempts}:</div>
    <div class="microcopy-result"> ${microcopy} </div>
    <div class="divider"></div>`;
    resultsDiv.innerHTML += copyResult;
    loadingSpinner.style.display = "none";
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    copyAttempts++;
};