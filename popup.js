let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('email-List');

// Handler to receive emails from current script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Get emails
    let emails = request.emails;

    // Display Emails on Popup

    if (emails == null || emails.length == 0){
        // No Emails
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
    } else {

        // Display Emails
        emails.forEach(email => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
            
        });
    }

})

// Button click event listener

scrapeEmails.addEventListener("click", async() => {
    // Get current active tab of chrome window

    let [tab] = await chrome.tabs.query({
        active: true, 
        currentWindow: true
    });

    // Script to parse Emails on page

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,
    });

})

//Function to scrape Emails

function scrapeEmailsFromPage() {


    //regex to parse emails from html

    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    //Parse Emails from the HTML of the page

    let emails = document.body.innerHTML.match(emailRegEx);

    // Send emails to popup

    chrome.runtime.sendMessage({emails});

}