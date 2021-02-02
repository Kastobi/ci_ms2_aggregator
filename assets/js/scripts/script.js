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
                "githubLink" : "not provided",
                "githubUser" : "not provided",
                "githubStarsCount" : 0,
                "partialByStars": "not provided",
                "githubForksCount" : 0,
                "githubSubsCount" : 0,
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
                "partialByStars": selectPartial(element.github.stargazers_count),
                "githubForksCount" : element.github.forks,
                "githubSubsCount" : element.github.subscribers_count,
            }
        };     
        cdnjsFlatList.push(newItem);
    });         
};

function selectPartial(stars) {
    if (stars === 0) {
        return "zero stars"
    } else if (stars >= 1 && stars <= 10) {
        return "one to ten"
    } else if (stars >= 11 && stars <= 100) {
        return "ten to hundred"
    } else if (stars >= 101 && stars <= 1000) {
        return "hundred to thousand"
    } else if (stars >= 1001 && stars <= 10000) {
        return "thousand to ten thousand"
    } else if (stars >= 10001 && stars <= 100000) {
        return "ten thousand to one hundred thousand"
    } else {
        return "more than one hundred thousand"
    }
}

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

    // Full Copy
    // Reference: https://dc-js.github.io/dc.js/examples/filtering-removing.html line 49++
       function remove_empty_bins(source_group) {
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    return d.value !== 0;
                })
            }
        }
    }
    // End of Copy

    const dimName = fullDataset.dimension(d => d["name"]);

    const dimGithubStarsCount = fullDataset.dimension(d => d["githubStarsCount"]);
    const groupGithubStars = dimName.group().reduceSum(d => d["githubStarsCount"]);
    const groupNonNullStars = remove_empty_bins(groupGithubStars);

    const dimPartialStars = fullDataset.dimension(d => d["partialByStars"]);
    const groupPartialStarsWithZeros = dimPartialStars.group().reduceCount(d => d["partialByStars"]);
    const groupPartialStars = remove_empty_bins(groupPartialStarsWithZeros);

    const dimForksCount = fullDataset.dimension(d => d["githubForksCount"]);
    const dimSubsCount = fullDataset.dimension(d => d["githubSubsCount"]);

    const dimGithubUser = fullDataset.dimension(d => d["githubUser"]);
    const groupGithubUser = dimGithubUser.group();

    const keywordsProvided = fullDataset.dimension(function(d) {return d.keywords}, true);
    const keywordsIndex = keywordsProvided.group();

    // dc section

    let dcVisCounter = new dc.DataCount("#dcVisCounter");
    const dcPartialsPie = new dc.PieChart("#partialsByStars")
    let dcRangeGraph = new dc.BarChart("#dcRangeGraph");
    let dcDataTable = dc.dataTable("#dcDataTable");

    // Full Copy, altered links
    // Reference: http://dc-js.github.io/dc.js/stock.js line 426++
    dcVisCounter
        .crossfilter(fullDataset)
        .groupAll(fullDatasetGroup)
        .html({
            some:
                "<strong>%filter-count</strong> selected out <strong>%total-count</strong> records" +
                " | <a href=\"javascript:dc.filterAll(); dc.renderAll();\">Reset All</a>",
            all: "All records selected. Please click ?? to apply filters."
        }
    );
    // End of Copy

    dcPartialsPie
        .dimension(dimPartialStars)
        .group(groupPartialStars)
        .radius(100)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .legend(new dc.HtmlLegend().container("#partialsLegend").horizontal(false).highlightSelected(true));

    dcRangeGraph
        .x(d3.scaleBand())
        .elasticX(true)
        .xUnits(dc.units.ordinal)

        .y(d3.scaleLinear())
        .elasticY(true)
        .yAxisLabel("no of github stars")

        .dimension(dimName)
        .mouseZoomable(true)
        .group(groupNonNullStars)

    //dcRangeScale.on("renderlet", d => d.selectAll("g.x text").attr("transform", "rotate(-90)"));

    //todo: github provided test for data
    dcDataTable
        .dimension(dimGithubStarsCount)
        .size(Infinity)
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

    // User interaction

    // Input Nr Filter
    function filterByStars() {
        dimGithubStarsCount.filterAll();

        dimGithubStarsCount.filter(d => {
            if (d > 100000) {
                return d;
            }
        });
        let topRange = []
        dimGithubStarsCount.top(Infinity).forEach(d => topRange.push(d.name));
        dcRangeGraph.elasticX(false)
            .x(d3.scaleBand().domain(topRange));
        dc.redrawAll();
    }
    d3.select("#filterByStars").on("click", filterByStars);
};
