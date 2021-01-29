// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;
let cdnjsFlatList = [];

//dev purpose - todo: encapsulate vars
// crossfilter section
let fullDataset = null;
let fullDatasetGroup = null;

document.addEventListener("DOMContentLoaded", initSite);

async function initSite() {
    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    
    flattenFullList();
    //generateTable(); todo: evaluate/decision vs dc / crossfilter way, remember html anchors!
    initDataVis();
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
                "githubUser" : "",
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
                "githubUser" : `https://www.github.com/${element.github.user}/`,
                "githubStarsCount" : element.github.stargazers_count,
                "githubForksCount" : element.github.forks,
                "githubSubsCount" : element.github.subscribers_count,
            }
        };     
        cdnjsFlatList.push(newItem);
    });         
};

// html table related
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

function initDataVis() {

    // crossfilter section

    fullDataset = crossfilter(cdnjsFlatList);
    fullDatasetGroup = fullDataset.groupAll();

    const dimGithubStarsCount = fullDataset.dimension(d => d["githubStarsCount"]);
    const dimForksCount = fullDataset.dimension(d => d["githubForksCount"]);
    const dimSubsCount = fullDataset.dimension(d => d["githubSubsCount"]);

    const dimGithubUser = fullDataset.dimension(d => d["githubUser"]);
    const groupGithubUser = dimGithubUser.group();

    const keywordsProvided = fullDataset.dimension(function(d) {return d.keywords}, true);
    const keywordsIndex = keywordsProvided.group();

    // dc section

    let dcVisCounter = dc.dataCount("#dcVisCounter");
    let dcDataTable = dc.dataTable("#dcDataTable");

    //Reference: http://dc-js.github.io/dc.js/ stock.js Example counter, line 426++
    dcVisCounter
        .crossfilter(fullDataset)
        .groupAll(fullDatasetGroup)
        .html({
            some:
                "<strong>%filter-count</strong> selected out <strong>%total-count</strong> records" +
                " | <a href=\"javascript:dc.filterAll(); dc.renderAll();\">Reset All</a>",
            all: "All records selected. Please click ?? to apply filters."
        });

    dcDataTable
        .dimension(dimGithubStarsCount)
        .size(100)
        .showSections(false)
        .columns([
            {
                label: "Package name",
                format: d => d.name
            },
            {
                label: "GitHub stars",
                format: d => d.githubStarsCount
            },
            {
                label: "GitHub forks",
                format: d => d.githubForksCount
            },
            {
                label: "GitHub subs",
                format: d => d.githubSubsCount
            },
            {
                label: "GitHub user",
                format: d => d.githubUser
            },
            {
                label: "GitHub link",
                format: d => d.githubLink
            }
        ])
        .order(d3.descending)
    dc.renderAll();
};
