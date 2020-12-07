// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;

document.addEventListener("DOMContentLoaded", initSite);

async function initSite() {
    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    generateTable();
};

// cdnjs api call with keyword and github values included
async function fetchCdnjsLibrariesFullList() {
        const result = await d3.json("https://api.cdnjs.com/libraries?fields=keywords,github")
            .catch(error => console.log(error));
        return result.results;
    };

function generateTable() {
    generateTableHead();
    generateTableBody();
};

function generateTableHead() {
    let keysOfList = Object.keys(cdnjsFullList[0]);
    
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
    let columns = Object.keys(cdnjsFullList[0]);
    
    d3.select("#mainTable")
        .append("tbody")
        
        //generate rows
        .selectAll("tr")
        .data(cdnjsFullList)
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