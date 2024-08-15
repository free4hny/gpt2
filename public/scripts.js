async function submitPrompt() {
    const prompt = document.getElementById('userPrompt').value;
    if (prompt) {
        try {
            // Send the user prompt to the server
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            // Display the initial prompt used for both GPT-1 and GPT-2
            document.getElementById('gpt1Prompt').value = prompt;
            document.getElementById('gpt2Prompt').value = prompt;

            // Display the results returned from the server
            document.getElementById('gpt1Result').value = data.gpt1Result;
            document.getElementById('gpt2Result').value = data.gpt2Result;

            // Show the comparison of content lengths
            const comparison = `Comparison result:\n\nOpenAI ChatGPT Content Length: ${data.gpt1Result.length}\n\nGoogle's GEMINI Content Length: ${data.gpt2Result.length}`;
            document.getElementById('comparisonResult').value = comparison;

            // Determine the winner based on content length
            const gpt1ResultLength = data.gpt1Result.length;
            const gpt2ResultLength = data.gpt2Result.length;

            const winnerMessage = gpt1ResultLength > gpt2ResultLength 
                ? "OpenAI's Chat GPT Wins!! It has generated more content." 
                : "Google's Gemini Wins!! It has generated more content.";

            document.getElementById('winnerResult').value = winnerMessage;

            // Display the optimized result in the final result text box
            const conclusion = `Final optimized result: ${data.optimizedResult}`;
            document.getElementById('finalResult').value = conclusion;

        } catch (error) {
            console.error('Error:', error);
            alert('Error generating result. Please try again.');
        }
    } else {
        alert("Please enter a prompt.");
    }
}
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}
// Function to change the textarea color dynamically
// Function to change the textarea color dynamically


// function changeTextareaColor(textarea, colorClass) {
//     textarea.classList.remove('color-blue', 'color-green', 'color-yellow', 'color-red');
//     textarea.classList.add(colorClass);
// }

// async function submitPrompt() {
//     const prompt = document.getElementById('userPrompt').value;
//     if (prompt) {
//         try {
//             // Send the user prompt to the server
//             const response = fetch('/api/generate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ prompt })
//             });

//             const data = await response.json();

//             // Generate random color classes for text areas
//             const colorClasses = ['color-blue', 'color-green', 'color-yellow', 'color-red'];
//             const randomColor1 = colorClasses[Math.floor(Math.random() * colorClasses.length)];
//             const randomColor2 = colorClasses[Math.floor(Math.random() * colorClasses.length)];
//             const randomColor3 = colorClasses[Math.floor(Math.random() * colorClasses.length)];
//             const randomColor4 = colorClasses[Math.floor(Math.random() * colorClasses.length)];
//             const randomColor5 = colorClasses[Math.floor(Math.random() * colorClasses.length)];
//             const randomColor6 = colorClasses[Math.floor(Math.random() * colorClasses.length)];

//             // Apply colors to text areas
//             changeTextareaColor(document.getElementById('gpt1Prompt'), randomColor1);
//             changeTextareaColor(document.getElementById('gpt2Prompt'), randomColor2);
//             changeTextareaColor(document.getElementById('gpt1Result'), randomColor3);
//             changeTextareaColor(document.getElementById('gpt2Result'), randomColor4);
//             changeTextareaColor(document.getElementById('comparisonResult'), randomColor5);
//             changeTextareaColor(document.getElementById('winnerResult'), randomColor6);

//             //get the values from HTML Form for API Keys
//             // document.getElementById('apiKeyForm').addEventListener('submit', function(event) {
//             //     event.preventDefault();  // Prevent the form from submitting traditionally
            
//             //     // Get the input values
//             //     const gemini = document.getElementById('GOOGLE_GEMINI_API_KEY').value;
//             //     const openai = document.getElementById('OPENAI_API_KEY').value;
            
//             //     // Send the API keys to the server via a POST request
//             //     fetch('/api/submit-key', {
//             //         method: 'POST',
//             //         headers: {
//             //             'Content-Type': 'application/json'
//             //         },
//             //         body: JSON.stringify({ gemini, openai, prompt: "your_prompt_here"})
//             //     })
//             //     .then(response => response.json())
//             //     .then(data => {
//             //         console.log('Server response:', data);
//             //         document.getElementById('responseMessage').textContent = `Key received: ${data.keyReceived}`;
//             //         alert('API keys submitted successfully');
//             //     })
//             //     .catch(error => {
//             //         console.error('Error:', error);
//             //         alert('Error submitting API keys');
//             //         document.getElementById('responseMessage').textContent = 'Error submitting API key';
//             //     });
//             // });
            


//             // Display the initial prompt used for both GPT-1 and GPT-2
//             document.getElementById('gpt1Prompt').value = prompt;
//             document.getElementById('gpt2Prompt').value = prompt;

//             // Display the results returned from the server
//             document.getElementById('gpt1Result').value = data.gpt1Result;
//             document.getElementById('gpt2Result').value = data.gpt2Result;

//             // Show the comparison of content lengths
//             const comparison = `Comparison result:\n\nOpenAI ChatGPT Content Length: ${data.gpt1Result.length}\n\nGoogle's GEMINI Content Length: ${data.gpt2Result.length}`;
//             document.getElementById('comparisonResult').value = comparison;

//             // Determine the winner based on content length
//             const gpt1ResultLength = data.gpt1Result.length;
//             const gpt2ResultLength = data.gpt2Result.length;

//             const winnerMessage = gpt1ResultLength > gpt2ResultLength 
//                 ? "OpenAI's Chat GPT Wins!! It has generated more content." 
//                 : "Google's Gemini Wins!! It has generated more content.";

//             document.getElementById('winnerResult').value = winnerMessage;

//             // Display the optimized result in the final result text box
//             const conclusion = `Final optimized result: ${data.optimizedResult}`;
//             document.getElementById('finalResult').value = conclusion;

//         } catch (error) {
//             // console.error('Error:', error);
//             alert('Error generating result. Please try again.');
//         }
//     } else {
//         alert("Please enter a prompt.");
//     }
// }
