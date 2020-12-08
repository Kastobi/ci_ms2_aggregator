// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;
let cdnjsFlatList = [];

document.addEventListener("DOMContentLoaded", initSite);

async function initSite() {
    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    
    flattenFullList();
    generateTable();
};

// cdnjs api call with keyword and github values included
async function fetchCdnjsLibrariesFullList() {
        const result = await d3.json("https://api.cdnjs.com/libraries?fields=keywords,github")
            .catch(error => console.log(error));
        return result.results;
    };

// build list for starting table

function flattenFullList() {
    cdnjsFullList.forEach((element, index) => {
        let newItem;
        if (element.github === null) {
            newItem = {
                "index" : index,
                "name" : element.name,
                "keywords" : element.keywords,
                "githubProvided": false,
                "githubLink" : "",        
                "githubStarsCount" : "",
                "githubForksCount" : "",
                "githubSubsCount" : "",
            }
        } else {
            newItem = {
                "index" : index,
                "name" : element.name,
                "keywords" : element.keywords,
                "githubProvided" : true,
                "githubLink" : `https://www.github.com/${element.github.user}/${element.github.repo}`,        
                "githubStarsCount" : element.github.stargazers_count,
                "githubForksCount" : element.github.forks,
                "githubSubsCount" : element.github.subscribers_count,
            }
        };     
        cdnjsFlatList.push(newItem);
    });         
};

// table related
function generateTable() {
    generateTableHead();
    generateTableBody();
};

function generateTableHead() {
    let keysOfList = Object.keys(cdnjsFlatList[0]);
    
    d3.select("#mainTable")
        .append("thead")
        .append("tr")
        .selectAll("th")
        .data(keysOfList)
        .enter()
        .append("th")
        .text(i => i)
};

function generateTableBody() { 
    let columns = Object.keys(cdnjsFlatList[0]);
    
    d3.select("#mainTable")
        .append("tbody")
        
        //generate rows
        .selectAll("tr")
        .data(cdnjsFlatList)
        .enter()
        .append("tr")

        //generate cells
        .selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]}
            })
        })
        .enter()
        .append("td")
        .text(i => i.value);
};