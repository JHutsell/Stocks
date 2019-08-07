class StocksAdapter {

	static baseUrl() {
		return `http://localhost:3000`;
	}

  static stockSysmbolListUrl() {
    return `https://financialmodelingprep.com/api/v3/company/stock/list`;
  }

  static companyProfileUrl() {
    return `https://financialmodelingprep.com/api/v3/company/profile/`;
  }

  static realTimeUrl() {
    return `https://financialmodelingprep.com/api/v3/stock/real-time-price/`
  }

	static getHeaders(){
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  }

  static fetchConfig(verb, bodyObject) {
    return {
      method: verb,
      headers: this.getHeaders(),
      body: JSON.stringify(bodyObject)
    }
  }

  static createWatchlist(watchlist) {
    const fetchConfig = this.fetchConfig("POST", watchlist);
    return fetch(this.baseUrl() + "/watchlists", fetchConfig)
      .then(res => res.json());
  }

  static deleteStock(item) {
    fetch(this.baseUrl() + `/stock_cards/` + item.dataset.id,  {
      method: "DELETE",
      headers: this.getHeaders()
    })
    .then(item.remove())
  }

  static search(stocks, input) {
    for (let stockInfo of stocks) {
      if (stockInfo.name.split(" ")[0].toLowerCase() === input.split(" ")[0].toLowerCase() || 
          stockInfo.symbol.split(" ")[0].toLowerCase() === input.split(" ")[0].toLowerCase()) {
        return stockInfo.symbol;
      }
    }
  }

  static getCompanyProfile(symbol) {
    return fetch(this.companyProfileUrl() + symbol.toUpperCase())
    .then(res => res.json())
  }

  static getStockList() {
    return fetch(this.stockSysmbolListUrl())
    .then(res => res.json())
  }

  // add stock to a watchlist
static addStockToWatchList(watch_list_id, symbol) {
  fetch(this.baseUrl() + `/stock_cards`, this.fetchConfig("POST", {watch_list_id, symbol}))
  .then(res => res.json())
}

  static getWatchlistOptions(userId) {
    let option = document.createElement("option")
    option.innerText = "";
    option.dataset.id = ""
    let select = document.querySelector('#watchlist-select');
    select.append(option);
    UserAdapter.getUser(userId)
    .then(userData => {
      for (let wl of userData.watch_lists) {
        this.createOption(wl);
      }
      let select = document.querySelector('#watchlist-select');

      select.addEventListener("change", event => {
        let index = event.target.selectedIndex
        let symbol = document.querySelector('#ticker').innerText
        let watchlist_id = parseInt(userData.watch_lists[index - 1].id)
        this.addStockToWatchList(watchlist_id, symbol);
        this.addWatchListToDOM(watchlist_id);
      })
    })
  }
  
  static createDiv(stockInfo) {
    let stockProfile = stockInfo.profile;
    let showedStockDiv = document.querySelector("#search-stock-div");
    showedStockDiv.innerHTML = `<div id="pop-up-stock-search">
    <div class="pop-up-stock-left">
    <img src=${stockProfile.image}>
    <h3>${stockProfile.companyName}</h3>
    <h4 id="ticker">${stockInfo.symbol}</h4>
    <p>Price: $${stockProfile.price}</p>
    <p class="info">Description: <br>${stockProfile.description}</p>
    <p class="info">Sector: ${stockProfile.sector}</p>
    <a href=${stockProfile.website} target="_blank">Website</a> <br>
    <label for="add-stock">Add Stock to a Watchlist:</label>
    <select name="Add Stock to Watchlist" id="watchlist-select">
    </select>
    </div>
    <div class="pop-up-stock-right">
    <button name="exit" id="exit-button">x</button>
    </div
    </div>`;
    let exitButton = showedStockDiv.querySelector('#exit-button');
    exitButton.addEventListener("click", function() {
      showedStockDiv.innerHTML = `<form id="search-stock">
      <label for="stock-query">Search Stocks</label>
      <input name="stock" type="text" class="form-control" id="stock-query" placeholder="Enter Ticker or Name">
      <button type="submit">search</button>
      </form>`;
    })
    document.body.append(showedStockDiv);
    let userId = document.querySelector('#userDiv').dataset.id;
    console.log(this)
    StocksAdapter.getWatchlistOptions(userId);
  }
  

  static createOption(watchlist) {
    let option = document.createElement("option")
    option.innerText = watchlist.name
    option.dataset.id = watchlist.id
    let select = document.querySelector('#watchlist-select');
    select.append(option);
  }

  static slapOnTheDOM(stockInfo) {
    let watchlist = document.querySelector('#listOfCurrentWatchlist');
    let listItem = document.createElement('li');
    watchlist.append(listItem);
    listItem.dataset.id = stockInfo.id;
    this.getRealTimePrice(stockInfo.symbol)
    .then(realTimeStock => {
      listItem.innerHTML += `<span>${stockInfo.symbol} - $${realTimeStock.price}      </span>`;
      listItem.innerHTML += `<button class="delete-list">Delete</button>`
    });
    listItem.addEventListener('click', event => {
      if (event.target.className === 'delete-list') {
        this.deleteStock(event.target.parentElement);
      }
      else if (event.target.tagName === 'SPAN') {
        StocksAdapter.getCompanyProfile(event.target.innerText.split(" - ")[0])
        .then(StocksAdapter.createDiv);
      }
    });
  }

  static makeCurrentWatchlist(watchlistData) {
    let currentWatchlist = document.querySelector('#current-watchlist');
    currentWatchlist.innerHTML = `
      <h2>${watchlistData.name}</h2>
      <ul id="listOfCurrentWatchlist"></ul>`;
    if (watchlistData.stock_cards.length > 0) { 
        for (let stock of watchlistData.stock_cards) {
          this.slapOnTheDOM(stock);
      }
    }
  }

  static getRealTimePrice(symbol) {
    return fetch(this.realTimeUrl() + `${symbol.toUpperCase()}`)
    .then(res => res.json());
  }

  static addWatchListToDOM(watchlistId) {
    WatchListAdapter.getWatchList(watchlistId)
    .then(watchlistData => {
      //console.log(watchlistData);
      this.makeCurrentWatchlist(watchlistData)
    });
    //this.clickEvents();
  }

}

