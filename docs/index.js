const SEARCH_STOCK = document.querySelector('#search-stock');
const SIGN_IN = document.querySelector('#signin');
const SIGNED_IN = false;
const SIGN_IN_DIV = document.querySelector('.signin')


// loads the content
document.addEventListener("DOMContentLoaded", event => {
});

document.addEventListener('submit', event => {
	event.preventDefault();
	console.log(event.target);
	if (event.target.id === "search-stock") {
		let input = event.target["stock-query"].value;
		StocksAdapter.getStockList()
		.then(stocks => StocksAdapter.search(stocks.symbolsList, input))
		.then(symbol => {
			if (symbol !== undefined){
				console.log(symbol)
				StocksAdapter.getCompanyProfile(symbol)
				.then(StocksAdapter.createDiv);
			}
			else {
				alert("Sorry, we could not find this stock for you. Try entering a different name.")
			}
		});
	}
})



SIGN_IN.addEventListener('click', event => {
	let signInDIv = event.target.parentElement;
	signInDIv.innerHTML = `<form id="loginForm"> 
		<label> Username </label>
		<input name="username" type="text" placeholder="username">
		<button id="sign-in-btn" type="submit">Submit</button>
	</form>`;
	signInDIv.innerHTML += `<button id="signout">Go back</button>`
});

SIGN_IN_DIV.addEventListener('submit', event => {
	event.preventDefault();
	let input = event.target.username.value;
	if (event.target.id === "signupForm") {
		UserAdapter.createUser(input)
		.then(WatchListAdapter.handleErrors)
		.then(user => {
			SIGN_IN_DIV.innerHTML = `Signed in as ${input}
					<br><button id="signout">Sign out</button>
					<div id="userDiv" data-id="${user.id}"></div>
					<div id="search-stock-div">
						<form id="search-stock">
							<label for="stock-query">Search Stocks</label>
							<input name="stock" type="text" class="form-control" id="stock-query" placeholder="Enter Ticker or Name">
							<button type="submit">search</button>
						</form>
					</div>
					<div id="watchlists">
						<h3>Watchlists</h3>
						<form id="watchListForm">
							<label for="new-watchlist">Create New Watchlist</label>
							<input name="watchlist" type="text" class="form-control" id="new-watchlist" placeholder="Enter Name for Watchlist">
							<button id="createWatchList" type="submit">+</button>
						</form>
						<ul id="watchlist-list">
						</ul>
					</div>
					<div id="current-watchlist">
					</div>`;
					WatchListAdapter.addWatchListsToDOM(user.id);
					let button=document.querySelector("#createWatchList")
					button.addEventListener('click', event => {
						event.preventDefault();
						console.log(event.target.parentElement.watchlist.value);
						WatchListAdapter.postWatchList(event.target.parentElement.watchlist.value);
						// if (event.target.id === "createWatchList") {
						
						// }
					});
		})
		.catch(error => console.log(error))
	}
	else {
		UserAdapter.getUsers()
		.then(users => {
			console.log(users)
			for (user of users) {
				if (user.name.toLowerCase() === input.toLowerCase()) {
					SIGN_IN_DIV.innerHTML = `Signed in as ${input}
					<br><button id="signout">Sign out</button>
					<div id="userDiv" data-id="${user.id}"></div>
					<div id="search-stock-div">
						<form id="search-stock">
							<label for="stock-query">Search Stocks</label>
							<input name="stock" type="text" class="form-control" id="stock-query" placeholder="Enter Ticker or Name">
							<button type="submit">search</button>
						</form>
					</div>
					<div id="watchlists">
						<h3>Watchlists</h3>
						<form id="watchListForm">
							<label for="new-watchlist">Create New Watchlist</label>
							<input name="watchlist" type="text" class="form-control" id="new-watchlist" placeholder="Enter Name for Watchlist">
							<button id="createWatchList" type="submit">+</button>
						</form>
						<ul id="watchlist-list">
						</ul>
					</div>
					<div id="current-watchlist">
					</div>`;
					WatchListAdapter.addWatchListsToDOM(user.id);
					let button=document.querySelector("#createWatchList")
					button.addEventListener('click', event => {
						event.preventDefault();
						console.log(event.target.parentElement.watchlist.value);
						WatchListAdapter.postWatchList(event.target.parentElement.watchlist.value);
						// if (event.target.id === "createWatchList") {
						
						// }
					});
					return;
				}
			}
			alert("An incorrect username has been provided.");
		})
	}
});

document.addEventListener('click', event => {
	if (event.target.id === "signout") {
		location.reload();
	}
	else if (event.target.id === "signup") {
		let signInDIv = event.target.parentElement;
		signInDIv.innerHTML = `<form id="signupForm"> 
			<label> Create username </label>
			<input name="username" type="text" placeholder="new user">
			<button id="sign-in-btn" type="submit">Submit</button>
		</form>`;
		signInDIv.innerHTML += `<button id="signout">Go back</button>`
	}
});