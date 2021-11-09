const text = document.getElementById("notify-text");
const notify = document.getElementById("notify-button");
const notify2 = document.getElementById("notify-button-2");
const reset = document.getElementById("notify-reset");
const counter = document.getElementById("notify-count");
const display = document.getElementById("notify-display");

chrome.storage.local.get(["notifyCount"], (data) => {
  let value = data.notifyCount || 0;
  counter.innerHTML = value;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.notifyCount) {
    let value = changes.notifyCount.newValue || 0;
    counter.innerHTML = value;
  }
});

reset.addEventListener("click", () => {
  chrome.storage.local.clear();
  text.value = "";
});

notify.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "notification",
    message: text.value,
  });
});

notify2.addEventListener("click", () => {
  var promise = $.ajax({
    method: "GET",
    url: "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=squid-game",
  });

  promise.then(
    function (response) {
      console.log(response);
      var pesho =
        response.data.name +
        " " +
        response.data.marketPairs[1].price +
        " " +
        response.data.marketPairs[1].quoteSymbol +
        " " +
        response.data.marketPairs[1].lastUpdated;
      $(".price").text(pesho);

      chrome.runtime.sendMessage("", {
        type: "notification",
        message: pesho,
        icon: "assets/images/icon-128.png",
      });
    },
    function (reason) {}
  );
});
