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
//   var promise = $.ajax({
//     method: "GET",
//     url: "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=squid-game",
//   });

//   promise.then(
//     function (response) {
//       console.log(response);
//       var pesho =
//         response.data.name +
//         " " +
//         response.data.marketPairs[1].price +
//         " " +
//         response.data.marketPairs[1].quoteSymbol +
//         " " +
//         response.data.marketPairs[1].lastUpdated;
//       $(".price").text(pesho);

//       chrome.runtime.sendMessage("", {
//         type: "notification",
//         message: pesho,
//         icon: "assets/images/icon-128.png",
//       });
//     },
//     function (reason) {}
var ws = new WebSocket("wss://stream.coinmarketcap.com/price/latest"),
    l = {
      timeout: 3e5,
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function () {
        clearTimeout(this.timeoutObj),
          clearTimeout(this.serverTimeoutObj),
          this.start();
      },
      start: function () {
        var e = this;
        this.timeoutObj = setTimeout(function () {
          ws.send("ping"),
            (e.serverTimeoutObj = setTimeout(function () {
              ws.close();
            }, e.timeout));
        }, this.timeout);
      },
    };
  ws.onopen = function () {
    l.start();
    $(".notify-display").text("Connection open ...");
    var cryptoData = {
      method: "subscribe",
      id: "price",
      data: {
        cryptoIds: [13276,1],
        index: "detail",
      },
    };
    ws.send(JSON.stringify(cryptoData)), (p = 15e3), clearTimeout(1);
  };
  ws.onmessage = function (e) {
    var r = JSON.parse(e.data);
    console.log(r.d);
    $(".price").text(r.d.cr.p);
    $(".notify-display").text("Last update date: " + Date((r.d.t + 7200) * 1000));
  };
  ws.onerror = function (e) {
    console.error("Socket encountered error: ", e.message, "Closing socket"),
      ws.close();
  };
});

//   var ws = new WebSocket("wss://stream.coinmarketcap.com/price/latest"),
//     l = {
//       timeout: 3e5,
//       timeoutObj: null,
//       serverTimeoutObj: null,
//       reset: function () {
//         clearTimeout(this.timeoutObj),
//           clearTimeout(this.serverTimeoutObj),
//       },
//       start: function () {
//         var e = this;
//         this.timeoutObj = setTimeout(function () {
//           ws.send("ping"),
//             (e.serverTimeoutObj = setTimeout(function () {
//               ws.close();
//             }, e.timeout));
//         }, this.timeout);
//       },
//     };
//   ws.onopen = function () {
//     l.start();
//     $(".notify-display").text("Connection open ...");
//     var cryptoData = {
//       method: "subscribe",
//       id: "price",
//       data: {
//         cryptoIds: [13276],
//         index: "detail",
//     };
//     ws.send(JSON.stringify(cryptoData)), (p = 15e3), clearTimeout(1);
//   };
//   ws.onmessage = function (e) {
//     var r = JSON.parse(e.data);
//     console.log(r.d);
//     $(".price").text(r.d.cr.p);
//     $(".display").text("Last update date: " + Date((r.d.t + 7200) * 1000));
//   };
//   ws.onerror = function (e) {
//     console.error("Socket encountered error: ", e.message, "Closing socket"),
//       ws.close();
//   };