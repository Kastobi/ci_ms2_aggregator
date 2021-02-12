// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;
let cdnjsFlatList = [];

//dev purpose - todo: encapsulate vars
// crossfilter section
let fullDataset = null;
let fullDatasetGroup = null;

document.addEventListener("DOMContentLoaded", initSite);

window.addEventListener('resize', () => dc.renderAll());

async function initSite() {
    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    flattenFullList();
    initDataVis();
}

// cdnjs api call with keyword and github values included
async function fetchCdnjsLibrariesFullList() {
    const result = await d3.json("https://api.cdnjs.com/libraries?fields=keywords,github")
        .catch(error => console.log(error));
    return result.results;
}

// build list for starting table

function flattenFullList() {
    cdnjsFullList.forEach((element, index) => {
        let newItem;
        if (element.github === null) {
            newItem = {
                "index": index,
                "name": element.name,
                "keywords": keywordsLowercased(element.keywords),
                "githubProvided": false,
                "githubLink": "not provided",
                "githubUser": "not provided",
                "githubStarsCount": 0,
                "partialByStars": "not provided",
                "githubForksCount": 0,
                "githubSubsCount": 0,
            }
        } else {
            newItem = {
                "index": index,
                "name": element.name,
                "keywords": keywordsLowercased(element.keywords),
                "githubProvided": true,
                "githubLink": `https://www.github.com/${element.github.user}/${element.github.repo}`,
                "githubUser": `https://www.github.com/${element.github.user}/`,
                "githubStarsCount": element.github.stargazers_count,
                "partialByStars": selectPartial(element.github.stargazers_count),
                "githubForksCount": element.github.forks,
                "githubSubsCount": element.github.subscribers_count,
            }
        }
        cdnjsFlatList.push(newItem);
    });
}

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

function keywordsLowercased(keywords) {
    let keysLower = [];
    keywords.forEach(d => keysLower.push(d.toLowerCase()));
    return keysLower;
}

function initDataVis() {

    // crossfilter section

    fullDataset = crossfilter(cdnjsFlatList);
    fullDatasetGroup = fullDataset.groupAll();

    // Full Copy, removing empty bins from graphs
    // Reference: https://dc-js.github.io/dc.js/examples/filtering-removing.html line 49++
    function remove_empty_bins(source_group) {
        return {
            all: function () {
                return source_group.all().filter(function (d) {
                    return d.value !== 0;
                })
            }
        }
    }
    // End of Copy

    //double dimension to filter between different index types, dimension does not filter itself
    const dimName = fullDataset.dimension(d => d["name"]);
    const dimNameForSearch = fullDataset.dimension(d => d["name"]);

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

    //double dimension to filter between different index types, dimension does not filter itself
    const keywordsProvided = fullDataset.dimension(function (d) {
        return d.keywords
    }, true);
    const keywordsProvidedTextSearch = fullDataset.dimension(function (d) {
        return d.keywords
    }, true);
    const keywordsIndex = keywordsProvided.group();

    // dc section

    const dcVisCounter = new dc.DataCount("#dcVisCounter");
    const dcPartialsRow = new dc.RowChart("#partialsByStarsRow");
    const keywordPackageSearch = new dc.TextFilterWidget("#keywordPackageSearch");
    const dcKeywordSelector = new dc.CboxMenu("#keywordSelector");
    const dcOverviewBarChart = new dc.BarChart("#dcOverviewBarChart");
    const searchByName = new dc.TextFilterWidget("#searchByName");
    const dcDataTable = dc.dataTable("#dcDataTable");

    // compareList var initialization for google trends compare, init for checkboxes in DataTable and first Load
    let compareList = [];
    firstLoadComparison();

    // Reference: http://dc-js.github.io/dc.js/stock.js line 426++
    dcVisCounter
        .crossfilter(fullDataset)
        .groupAll(fullDatasetGroup)
        .html({
                some:
                    "<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records " +
                    "<button id='resetAllButton'>Reset All</button>",
                all: "All records selected. Please click on a graph to apply filters."
            }
        )
        .on("renderlet", function () {
            d3.select("#resetAllButton")
                .on("click", function () {
                    resetAllFilters();
                })
        });

    function resetAllFilters() {
        dc.filterAll();

        // reset compare List
        compareList = [];
        updateCompareList();

        // reset slider
        const sliderDefault = document.getElementById("keywordSliderRange").defaultValue;
        document.getElementById("keywordSliderRange").value = sliderDefault;
        updateSlider(sliderDefault);

        dc.redrawAll();
    }

    dcPartialsRow
        .dimension(dimPartialStars)
        .group(groupPartialStars)
        // ordering by hand due to missing y axis on row charts class
        .ordering(d => {
            if (d.key === "not provided") return 7;
            else if (d.key === "zero stars") return 6;
            else if (d.key === "one to ten") return 5;
            else if (d.key === "ten to hundred") return 4;
            else if (d.key === "hundred to thousand") return 3;
            else if (d.key === "thousand to ten thousand") return 2;
            else if (d.key === "ten thousand to one hundred thousand") return 1;
            else if (d.key === "more than one hundred thousand") return 0;
        })
        .elasticX(true)
        .title( d => d.value + " packages of the selection got " + d.key + " stars")
        .turnOnControls()
        .on("renderlet", d => {
            //todo: move to css? pick color there?
            d.selectAll("g.row text").style("fill", "#000000");
        });

    // Filter keyword Index by text input => filters on packages with keyword
    keywordPackageSearch
        .dimension(keywordsProvidedTextSearch)
        .placeHolder("keyword")

    // Filter keyword Index by threshold of packages with keyword
    d3.select("#keywordSliderRange").on("change", function() {
        updateSlider(this.value);
    })
     // Reference: https://dc-js.github.io/dc.js/examples/adjustable-threshold.html, line 105++
    function updateSlider(slideValue) {
        let sliderDiv = document.getElementById("sliderValue");
        sliderDiv.innerHTML = slideValue;
        dcKeywordSelector
            .filterDisplayed(d => d.value >= slideValue)
        dc.redrawAll();
    }

    dcKeywordSelector
        .dimension(keywordsProvided)
        .group(keywordsIndex)
        .title(d => d.key)
        .multiple(true)
        .controlsUseVisibility(true)
        .filterDisplayed(d => d.value > 50)

    //Overview bar chart

    dcOverviewBarChart
        .x(d3.scaleBand())
        .elasticX(true)
        .xUnits(dc.units.ordinal)
        .xAxisLabel("packages (hover for info, click to select)");
    dcOverviewBarChart.xAxis()
        .tickValues([]);

    dcOverviewBarChart
        .y(d3.scaleLinear())
        .elasticY(true)
        .yAxisLabel("no of github stars")
        .margins().left = 70;

    dcOverviewBarChart
        .dimension(dimName)
        //.mouseZoomable(true) todo: implement, throws error + does not zoom
        .group(groupNonNullStars)
        .title(d => d.key + " got " + d.value + " stars on github");

    // DataTable

    // Search DataTable by name
    searchByName
        .dimension(dimNameForSearch)
        .placeHolder("name")

    // Pagination Data Table
    // Reference https://dc-js.github.io/dc.js/examples/table-pagination.html line 68++
    // copy, altered just in details
    let dataTablePageSize = 25;
    let dataTablePageStart = 0;
    let dataTablePageEnd = 24;
    let totFilteredRecs = fullDatasetGroup.value();


    function update_offset() {
        totFilteredRecs = fullDatasetGroup.value();
        dataTablePageEnd = dataTablePageStart + dataTablePageSize > totFilteredRecs ? totFilteredRecs : dataTablePageStart + dataTablePageSize;
        dataTablePageStart = dataTablePageStart >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / dataTablePageSize) * dataTablePageSize : dataTablePageStart;
        dataTablePageStart = dataTablePageStart < 0 ? 0 : dataTablePageStart;

        dcDataTable.beginSlice(dataTablePageStart);
        dcDataTable.endSlice(dataTablePageStart + dataTablePageSize);
    }

    function display() {
        totFilteredRecs = fullDatasetGroup.value();
        dataTablePageEnd = dataTablePageStart + dataTablePageSize > totFilteredRecs ? totFilteredRecs : dataTablePageStart + dataTablePageSize;
        d3.select('#begin')
            .text(dataTablePageEnd === 0 ? dataTablePageStart : dataTablePageStart + 1);
        d3.select('#end')
            .text(dataTablePageEnd);
        d3.select('#previousPageButton')
            .attr('disabled', dataTablePageStart - dataTablePageSize < 0 ? 'true' : null);
        d3.select('#nextPageButton')
            .attr('disabled', dataTablePageStart + dataTablePageSize >= totFilteredRecs ? 'true' : null);
        d3.select('#size').text(totFilteredRecs);
        if (totFilteredRecs !== fullDataset.size()) {
            d3.select('#totalsize').text("(filtered Total: " + fullDataset.size() + " )");
        } else {
            d3.select('#totalsize').text('');
        }
    }

    function nextPage() {
          dataTablePageStart += dataTablePageSize;
          update_offset();
          dcDataTable.redraw();
      }
    // end of full copy

    d3.select("#nextPageButton").on("click", function() {
        nextPage();
    })

    // full copy, reference as above, inserted d3 function for understanding
    function previousPage() {
        dataTablePageStart -= dataTablePageSize;
        update_offset();
        dcDataTable.redraw();
    }
    // end of full copy

    d3.select("#previousPageButton").on("click", function () {
        previousPage();
    })

    // DataTable
    dcDataTable
        .dimension(dimGithubStarsCount)
        .size(Infinity)
        .showSections(false)
        .columns([
            {
              label: "Compare trends",
              format: d => {
                return `<input type="checkbox" id="checkbox-${d.name}" value="${d.name}">
                <label for="checkbox-${d.name}">${d.name}</label>`
                }
            },
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
            },
            {
                label: "keywords provided",
                format: d => d.keywords
            }
        ])
        .order(d3.descending)
        .on("renderlet", function () {
            d3.selectAll(".dc-table-column > input")
                .each(function () {
                    if (compareList.includes(this.value)) {
                        this.checked = true;
                    }
            })
            d3.selectAll(".dc-table-column > input")
                .on("click", function () {
                updateCompareList(this.value);
            })
        })
        .on("preRender", update_offset)
        .on("preRedraw", update_offset)
        .on("pretransition", display)

    //Final dc.renderAll() -> end of dc part, renders all tables
    dc.renderAll();

    // Compare via Google trends part
    function updateCompareList(value) {
        if (compareList.includes(value)) {
            let index = compareList.indexOf(value);
            compareList.splice(index, 1);
            generateCompareDiv();
        } else if (compareList.length >= 3) {
            document.getElementById(`checkbox-${value}`).checked = false;
            alert("Please remove an item first, maximum of 3 items"); //todo: alert best way?
            generateCompareDiv();
        } else if (value == null) {
            generateCompareDiv();
        } else {
            compareList.push(value);
            generateCompareDiv();
        }

        function generateCompareDiv() {
            d3.select("#compareAnchor")
                .selectAll("button")
                .remove();
            d3.select("#compareAnchor")
                .selectAll("button")
                .data(compareList)
                .enter()
                .append("button")
                .attr("value", d => d)
                .text(d => d);
            d3.selectAll("#compareAnchor > button")
                .on("click", function() {
                    updateCompareList(this.value);
                    dcDataTable.redraw();
                });

            if (compareList.length !== 0) {
                d3.select("#compareAnchor")
                    .append("button")
                    .text("Show me the trends!")
                    .on("click", function () {
                        showTheTrends();
                    })

                d3.select("#compareAnchor")
                    .append("button")
                    .text("Reset")
                    .on("click", function() {
                        const compareListClone = [...compareList];
                        compareListClone.forEach(d => updateCompareList(d))
                        dcDataTable.redraw()
                    })
            }
        }
    }

    //todo: x-frame firefox policy problem?
    function showTheTrends() {
        d3.select("#googleAnchor")
            .select("#googleTrendsWidget")
            .remove();
        d3.select("#googleAnchor")
            .append("div")
            .attr("id", "googleTrendsWidget")

        const timeToday = new Date().toISOString().split("T")[0];
        const time5years = new Date().getFullYear() - 5 + timeToday.substring(4, 10);

        let comparisonItems = {"comparisonItem": []};

        compareList.forEach(d => {
            let keyword = {
                "keyword": d,
                "geo": "",
                "time": time5years + " " + timeToday
            }
            comparisonItems.comparisonItem.push(keyword);
        });

        comparisonItems.category = 0;
        comparisonItems.property = "";

        const queryItem = {
            "exploreQuery": "date=today%205-y",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        }

        const widget = document.getElementById("googleTrendsWidget");
        trends.embed.renderExploreWidgetTo(widget, "TIMESERIES", comparisonItems, queryItem);
    }

    function firstLoadComparison() {
        compareList = ["jquery", "vue", "react", "angular"];
        showTheTrends();
        compareList = [];
    }
}
