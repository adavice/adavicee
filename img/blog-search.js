let today = new Date();
let year = today.getFullYear();
document.querySelector('#year').innerText = year;

//if there are tags on page
let tags = document.querySelectorAll('.tag');
let searchForm = document.querySelectorAll('.search_block');
const onSearchPage = window.location.href.indexOf("search") > -1
if (tags.length > 0 || searchForm.length > 0) {
	if (searchForm.length > 0) {
		searchForm.forEach(form => {
			form.addEventListener('submit', searchByInput)
			
		})
	}
	
	const articleList = document.querySelectorAll(".article_container");
	let filterBase = [];
	let filterRequest = [];
	let filterType = "";
	let cloudTags = [];
	tags.forEach(tag => {
		tag.addEventListener("click", filterByTag)
		if (filterBase.indexOf(tag.innerHTML) < 0) {
			filterBase.push(tag.innerHTML)
		}
		filterBase.sort()
	});
	if (onSearchPage && sessionStorage.getItem('filterRequest')) {
		filterType = sessionStorage.getItem('filterType');
		filterRequest = [sessionStorage.getItem('filterRequest')];
		renderResults(filterType);
	}

	if (onSearchPage) {
		// building tag cloud
		
		tagPool = document.querySelector(".tag_pool")
		addTag("all")
		filterBase.forEach(el => {
			addTag(el)
		});
		tags = document.querySelectorAll('.tag');
		
		cloudTags = document.querySelectorAll('.tag_pool .tag')
		if (filterRequest.length < 1) {
			cloudTags[0].classList.add("active")
		}
		
	}
	
	function addTag(el) {
		let newTag = document.createElement("a");
		newTag.innerText = el;
		newTag.classList.add("tag");
		newTag.addEventListener("click", filterByTag)
		tagPool.appendChild(newTag);
		if (el === sessionStorage.getItem('filterRequest')) {
			newTag.classList.add("active");
		}
	}
	
	function filterByTag() {
		filterType = "byTag";
		if (onSearchPage) {
			sessionStorage.setItem('filterRequest', '')
			filterRequest = [];
			
			if (this.innerHTML === "all") {
				cloudTags.forEach(tag => {
					tag.classList.remove("active")
				})
				this.classList.add("active")
				renderResults()
				return true
			}
			cloudTags[0].classList.remove("active")
			cloudTags.forEach(tag => {
				if (tag.innerHTML === this.innerHTML) {
					tag.classList.toggle("active")
				}
			})
			document.querySelectorAll(".tag.active").forEach(tag => {
				if (filterRequest.indexOf(tag.innerHTML) < 0) {
					filterRequest.push(tag.innerHTML);
				}
			});
			renderResults(filterType);
		} else {
			sessionStorage.setItem("filterRequest", this.innerHTML);
			sessionStorage.setItem("filterType", "byTag")
			window.location = "/search.html"
		}
	}
	
	function searchByInput(event) {
		event.preventDefault();
		filterType = "search"
		let searchInput = this.querySelector('.input_search').value;
		filterRequest = [searchInput];
		if (onSearchPage) {
			sessionStorage.setItem('filterRequest', '')
			renderResults(filterType)
		} else {
			sessionStorage.setItem('filterRequest', searchInput);
			sessionStorage.setItem("filterType", "search")
			window.location = '/search.html';
		}
	}
	

	
	function renderResults(type) {
		
		const searchHeading = document.querySelector(".searchHeader");
		let shownCounter = 0;
		let tagsToDisplay = ""
		if (type === "byTag") {
			filterRequest.forEach(tag => {
				tagsToDisplay = tagsToDisplay + "#" + tag + " "
			})
			searchHeading.innerText = tagsToDisplay
		}
		if (type === "search") {
			document.querySelector(".input_search").value = filterRequest
			cloudTags.forEach(tag => {
				tag.classList.remove("active")
			})
			cloudTags.forEach(tag => {
				if (tag.innerText == filterRequest) {
					tag.classList.add("active")
				}
				
			})
			if (filterRequest == "") {
				searchHeading.innerText = "All"
				cloudTags[0].classList.add("active")
			} else {
				searchHeading.innerText = `Results for "${filterRequest}"`
			}
			
			
		}
		
		articleList.forEach(article => {
			article.setAttribute("data-filter", "0");
			article.querySelectorAll('.tag').forEach(tag => {
				if (filterRequest.indexOf(tag.innerHTML) !== -1 || article.getAttribute("data-filter") === "1") {
					article.setAttribute("data-filter", "1");
					article.classList.remove("hidden")
					shownCounter++
					return true
				} else if (type === "search") {
					article.querySelectorAll('h3').forEach(heading => {
						if (heading.innerHTML.toLowerCase().indexOf(filterRequest) !== -1 || tag.innerHTML.indexOf(filterRequest) !== -1) {
							article.classList.remove("hidden");
							
							shownCounter++
						} else {
							tag.setAttribute("data-filter", "0")
							article.classList.add("hidden")
						}
					})
				} else {
					tag.setAttribute("data-filter", "0")
					article.classList.add("hidden")
					
				}
			});
		})
		if (shownCounter === 0 && type !== "search") {
			articleList.forEach(article => {
				article.classList.remove("hidden");
				searchHeading.innerText = "All";
				document.querySelector(".tag").classList.add('active');
			})
		}
		if (shownCounter === 0 && type === "search") {
			searchHeading.innerText = 'No results found for "' + filterRequest + '"'
			tags[0].classList.remove("active")
		}
	}
}