// Global Variables
const endpoint = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const apiKey = prompt();

const validateInput = (input) => {
  if (!input.length) {
    return 'test '
  } else return input;
};

// Function to get the UX copy
const getUxCopy = () => {
  // Get the input values
  event.preventDefault();
  const copyGuidelines = document.getElementById("copy-guidelines").value;
  const productContext = document.getElementById("product-context").value;
  const userStory = document.getElementById("user-story").value;
  const desirableAction = document.getElementById("desirable-action").value;
  const reference = document.getElementById("reference").value;
  const charactersLimit = document.getElementById("characters-limit").value;

  if (!copyGuidelines || !productContext || !userStory || !desirableAction || !charactersLimit) {
    return alert('Fill all the required fields')
  };

  const finalPrompt = `Please, provide a UX copy according to the best practices and the following specifications: 1. Use the following Copy Guidelines: ${copyGuidelines}. 2. The UI element or use case for this UX copy will be following: ${productContext}; 3. Use case will be following: ${userStory}; 4. Desirable result or action should be according to the following: ${desirableAction}. 5. Generate the response according to the following text template:${reference};`;
  const promptTokensSize = finalPrompt.split(" ").length;
  const tokensLimit = Number(charactersLimit) + promptTokensSize;
  console.log(finalPrompt);

  const requestBody = JSON.stringify({
    prompt: finalPrompt,
    max_tokens: Number(charactersLimit),
    temperature: 0.5
  });

  // Fetch the UX copy from the OpenAI API
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: requestBody
  })
    .then(response => response.json())
    .then(data => {
      // Extract the generated UX copy from the API response
      const uxCopy = data.choices[0].text;
     
      // Display the generated UX copy on the page
      let result = document.getElementById("result");
      if (result.innerHTML.length === 0) {
        console.log(1)
        result.innerHTML += `${uxCopy}`;
      } else {
        console.log(2)
        result.innerHTML += `<br><br>  ${uxCopy}`
      }
    })
    .catch(error => {
      console.error(error);
      // document.getElementById("result").innerHTML = "Error: " + error;
    });
};