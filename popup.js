document.getElementById('summarize').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: summarizePageContent
        },
        (results) => {
          const pageContent = results[0].result;
          summarizeContent(pageContent).then(summary => {
            document.getElementById('summary').innerText = summary;
          });
        }
      );
    });
  });
  
  async function summarizePageContent() {
    const text = document.body.innerText;
    return text; // This is the content to summarize
  }
  
  async function summarizeContent(text) {
    const geminiApiKey = 'AIzaSyA1Md-seiKgN0D5SfPK4ctpb6Wn1KkjCGs';
    const geminiModel = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
  
    const payload = { contents: [{ parts: [{ text: text }] }] };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
  
    try {
      const response = await fetch(geminiModel, options);
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return 'Failed to summarize the page content.';
    }
  }
  