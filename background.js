import "assets/js/jquery-3.6.0.js";

chrome.runtime.onMessage.addListener( data => {
	if ( data.type === 'notification' ) {
		notify( data.message );
	}
});

chrome.runtime.onInstalled.addListener( () => {
	chrome.contextMenus.create({
		id: 'notify',
		title: "Notify!: %s", 
		contexts:[ "selection" ]
	});
});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
	if ( 'notify' === info.menuItemId ) {
		notify( info.selectionText );
	}
} );

const notify = message => {
	chrome.storage.local.get( ['notifyCount'], data => {
		let value = data.notifyCount || 0;
		chrome.storage.local.set({ 'notifyCount': Number( value ) + 1 });
	} );

	return chrome.notifications.create(
		'',
		{
			type: 'basic',
			title: 'Notify!',
			message: message || 'Notify!',
			iconUrl: './assets/icons/128.png',
		}
	);
};

// function createWebSocketConnection() {
//     if('WebSocket' in window){
//         chrome.storage.local.get("instance", function(data) {
//             connect('wss://' + data.instance + 'stream.coinmarketcap.com/price/latest');
//         });
//     }
// }

// //Make a websocket connection with the server.
// function connect(host) {
//     if (websocket === undefined) {
//         websocket = new WebSocket("stream.coinmarketcap.com/price/latest");
//     }
// }
//https://stackoverflow.com/questions/48746426/implement-websocket-in-chrome-extension


var ws = new WebSocket("wss://stream.coinmarketcap.com/price/latest");
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
