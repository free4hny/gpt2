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