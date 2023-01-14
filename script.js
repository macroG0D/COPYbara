// Global Variables
const endpoint = "https://api.openai.com/v1/engines/text-davinci-002/completions";
// const endpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions";
const apiKey = "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";

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

  const finalPrompt = `Please, provide a UX copy according to the best practices and the following details: Guidelines: ${copyGuidelines}; Product Context: ${productContext}; User Story: ${userStory}; Desirable Action: ${desirableAction}; Structure Reference:${reference};`;
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
      console.log(data)
      
      // Display the generated UX copy on the page
      let result = document.getElementById("result");
      if (result.innerHTML.length === 0) {
        console.log(1)
        result.innerHTML += `${uxCopy}`;
      } else {
        console.log(2)
        result.innerHTML += `<br><br> ${uxCopy}`
      }
      // document.getElementById("result").innerHTML += `<br><br> ${uxCopy}`;
      // const FinalTokensSize = uxCopy.split(" ").length;
      // console.log(FinalTokensSize)
    })
    .catch(error => {
      console.error(error);
      document.getElementById("result").innerHTML = "Error: " + error;
    });
};