console.log("%cpopup","color:green")

document.getElementById("target").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage( tabs[0].id, {action: "start"} );
  });
});