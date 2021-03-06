const Times = document.getElementById('times')
const Burger = document.getElementById('menu')
const Copy = document.getElementById('Copy');
const Quote = document.getElementById('Quote');
const Reload = document.getElementById('reload')
const pwaBTN = document.getElementById('pwa')
const QuoteBox = document.getElementById('QuoteBox');
const quoteText = document.getElementById('quoteText');
const authorText = document.getElementById('authorText');
const twitterBtn = document.getElementById('twitterBtn');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const DropDown = document.getElementById('dropDown')
const Save = document.getElementById('Save')
const Status = document.getElementById('status')
window.addEventListener("load", () => {
  if(navigator.onLine !== true){
    Status.classList.remove('online')
    Status.classList.add('offline')
  }
});
Reload.addEventListener('click',()=>{
  location.reload()
})
const SubMenuHandle = () =>{
  Burger.classList.toggle('hidden')
  Times.classList.toggle('hidden')
  DropDown.classList.toggle('hidden')
  QuoteBox.classList.toggle('outOfScrren')
}
Burger.addEventListener('click',()=>{
  SubMenuHandle()
})
Times.addEventListener('click',()=>{
  SubMenuHandle()
})
DropDown.addEventListener('click',()=>{
  SubMenuHandle()
})
// 
function newQuote() {
    // Pick a random quote from array
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    // Check if Author field is blank and replace it with 'Unknown'
    if (!quote.author) {
      authorText.textContent = 'Unknown';
    } else {
      authorText.textContent = quote.author;
    }
    quoteText.textContent = quote.text;
  }
  async function getQuotes() {
    const apiUrl ='https://type.fit/api/quotes';
    try {
      const response = await fetch(apiUrl);
      apiQuotes = await response.json();
      newQuote();
    } catch (error) {
      // Catch Error Here
    }
  }
  
  // Tweet Quote
  function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${authorText.innerText}`;
    window.open(twitterUrl, '_blank');
  }
  Copy.addEventListener('click',()=>{
    copyText(quoteText,authorText)
    flashElement(quoteText)
  })
  function copyText(quoteText,authorText) {
    var textToCopy = quoteText.innerText + " " +  '-'+ authorText.innerText;
    var myTemporaryInputElement = document.createElement("input");
    myTemporaryInputElement.type = "text";
    myTemporaryInputElement.value = textToCopy;
    document.body.appendChild(myTemporaryInputElement);
    myTemporaryInputElement.select();
    document.execCommand("Copy");
    document.body.removeChild(myTemporaryInputElement);
  }
  function flashElement(quoteText) {
    quoteText.classList.add("flash");
    authorText.classList.add("flash");
    document.addEventListener("transitionend", function() {
      setTimeout(function() {
        quoteText.classList.remove("flash");
        authorText.classList.remove("flash");
      },500);
    });
  }
  // Event Listeners
  newQuoteBtn.addEventListener('click', newQuote);
  twitterBtn.addEventListener('click', tweetQuote);
  
  // On Load
  getQuotes();
Save.addEventListener('click',()=>{
  domtoimage.toBlob(document.getElementById('Quote'))
    .then(function (blob) {
        window.saveAs(blob, `quote.${quoteText.innerText} ${authorText.innerText}.png`);
    });
})

  // PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('serviceWorker.js');
    });
  }
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {

    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    pwaBTN.classList.remove('hidden')
  
    pwaBTN.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      pwaBTN.classList.add('hidden')
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });