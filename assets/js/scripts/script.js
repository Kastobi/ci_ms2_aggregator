/*jshint esversion: 8 */
/*globals d3, crossfilter, dc, trends, console, $*/

// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;
let cdnjsProcessedList = [];

document.addEventListener("DOMContentLoaded", initSite);

window.addEventListener("resize", () => dc.renderAll());

async function initSite() {
    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    flattenFullList();

    initDataVis();
}

/**
 * API call to cdnjs
 * API documentation: https://cdnjs.com/api
 * @async
 * @returns {Promise} returns JSON object
 */
async function fetchCdnjsLibrariesFullList() {
    const result = await d3.json("https://api.cdnjs.com/libraries?fields=keywords,github")
        .catch(error => console.log(error));
    return result.results;
}

/**
 * Iterate over "cdnjsFullList" and process the data for following functions
 * Pushes items to existing array "cdnjsFlatList"
 * Uses keywordsLowercased(), assignRange()
 */
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
                "rangeByStars": "stars not provided",
                "githubForksCount": 0,
                "githubSubsCount": 0,
            };
        } else {
            newItem = {
                "index": index,
                "name": element.name,
                "keywords": keywordsLowercased(element.keywords),
                "githubProvided": true,
                "githubLink": `https://www.github.com/${element.github.user}/${element.github.repo}`,
                "githubUser": `https://www.github.com/${element.github.user}/`,
                "githubStarsCount": element.github.stargazers_count,
                "rangeByStars": assignRange(element.github.stargazers_count),
                "githubForksCount": element.github.forks,
                "githubSubsCount": element.github.subscribers_count,
            };
        }
        cdnjsProcessedList.push(newItem);
    });
}

/**
 * Function used by flattenFullList()
 * Assign range group based on github stars
 * @param {number} stars
 * @returns {string}
 */
function assignRange(stars) {
    if (stars === 0) {
        return "zero stars";
    } else if (stars >= 1 && stars <= 10) {
        return "1 to 10 stars";
    } else if (stars >= 11 && stars <= 100) {
        return "10 to 100 stars";
    } else if (stars >= 101 && stars <= 1000) {
        return "100 to 1,000 stars";
    } else if (stars >= 1001 && stars <= 10000) {
        return "1,000 to 10,000 stars";
    } else if (stars >= 10001 && stars <= 100000) {
        return "10,000 to 100,000 stars";
    } else {
        return "more than 100,000 stars";
    }
}

/**
 * Function used by flattenFullList()
 * Normalize keywords to lowercase
 * @param {array} keywords
 * @returns {[]}
 */
function keywordsLowercased(keywords) {
    let keysLower = [];
    keywords.forEach(d => keysLower.push(d.toLowerCase()));
    return keysLower;
}

/**
 * After the API data is processed, start the visualization
 */
function initDataVis() {

    // removes deprecated d3feature from dc / prevents console warning
    dc.config.defaultColors(d3.schemeDark2);

    let fullDataset = null;
    let fullDatasetGroup = null;

    // crossfilter section, define dimensions and groups
    fullDataset = crossfilter(cdnjsProcessedList);
    fullDatasetGroup = fullDataset.groupAll();

    /**
     * Full Copy, provides prefiltered pseudo group by filtering empty bins out from charts
     * Reference: https://dc-js.github.io/dc.js/examples/filtering-removing.html line 49++
     * @param source_group crossfilter-group for prefiltering
     * @returns prefiltered crossfilter pseudo group
     */
    function remove_empty_bins(source_group) {
        return {
            all: function () {
                return source_group.all().filter(function (d) {
                    return d.value !== 0;
                });
            }
        };
    }
    // End of Copy

    // define crossfilter dimensions and groups
    const dimNameForTextSearch = fullDataset.dimension(d => d.name);

    const dimGithubStarsForDataTable = fullDataset.dimension(d => d.githubStarsCount);

    const dimStarsRange = fullDataset.dimension(d => d.rangeByStars);
    const groupStarsRangeWithZeros = dimStarsRange.group().reduceCount(d => d.rangeByStars);
    const groupStarsRange = remove_empty_bins(groupStarsRangeWithZeros);

    const dimGithubUser = fullDataset.dimension(d => d.githubUser);

    //double dimension to filter between different charts with same dimension
    // due to crossfilter dimensions do not filter themselves
    const keywordsProvided = fullDataset.dimension(function (d) {
        return d.keywords;
    }, true);
    const keywordsProvidedTextSearch = fullDataset.dimension(function (d) {
        return d.keywords;
    }, true);
    const keywordsIndex = keywordsProvided.group();

    // google trends and dc section - define charts and render them

    const dcVisCounter = new dc.DataCount("#dcVisCounter");
    const dcStarsRangeRowChart = new dc.RowChart("#StarsRangeRowChart");
    const keywordPackageSearch = new dc.TextFilterWidget("#keywordPackageSearch");
    const dcKeywordSelector = new dc.CboxMenu("#keywordSelector");
    const searchByName = new dc.TextFilterWidget("#searchByName");
    const searchByRepoOwner = new dc.TextFilterWidget("#searchByRepoOwner");
    const dcDataTable = dc.dataTable("#dcDataTable");

    // Google Trends part

    let compareList = [];

    /**
     * Preload GoogleTrends comparison with "vue", "react", "angular" as showcase.
     */
    function firstLoadComparison() {
        compareList = ["vue", "react", "angular"];
        showTheTrends();
        compareList = [];
    }

    // Load GoogleTrends on first load
    firstLoadComparison();

    /**
     * update compare list to generate GoogleTrends chart
     * @param value package name from DataTable checkbox
     */
    function updateCompareList(value) {
        if (compareList.includes(value)) {
            let index = compareList.indexOf(value);
            compareList.splice(index, 1);
            generateCompareDiv();
        } else if (compareList.length >= 3) {
            document.getElementById(`checkbox-${value}`).checked = false;
            $("#comparisonModal").modal('toggle');
            generateCompareDiv();
        } else if (value == null) {
            generateCompareDiv();
        } else {
            compareList.push(value);
            generateCompareDiv();
        }

        function generateCompareDiv() {
            d3.select("#compareButtonsAnchor")
                .selectAll("button")
                .remove();

            d3.select("#compareButtonsAnchor")
                .selectAll("button")
                .data(compareList)
                .enter()
                .append("button")
                .attr("value", d => d)
                .attr("aria-label", d => "Remove " + d + " from to compare list.")
                .text(d => d);

            d3.selectAll("#compareButtonsAnchor > button")
                .attr("class", "btn compareItemButton")
                .on("click", function () {
                    updateCompareList(this.value);
                    dcDataTable.redraw();
                });

            if (compareList.length !== 0) {
                d3.select("#compareButtonsAnchor")
                    .append("button")
                    .attr("class", "btn")
                    .text("Show me the trends!")
                    .on("click", function () {
                        showTheTrends();
                    });

                d3.select("#compareButtonsAnchor")
                    .append("button")
                    .attr("class", "btn")
                    .text("Reset")
                    .on("click", function () {
                        const compareListClone = [...compareList];
                        compareListClone.forEach(d => updateCompareList(d));
                        dcDataTable.redraw();
                    });
            }
        }
    }

    function showTheTrends() {
        d3.select("#googleAnchor")
            .select("#googleTrendsWidget")
            .remove();
        d3.select("#googleAnchor")
            .append("div")
            .attr("id", "googleTrendsWidget");

        const timeToday = new Date().toISOString().split("T")[0];
        const time5years = new Date().getFullYear() - 5 + timeToday.substring(4, 10);

        let comparisonItems = {"comparisonItem": []};

        compareList.forEach(d => {
            let keyword = {
                "keyword": d,
                "geo": "",
                "time": time5years + " " + timeToday
            };
            comparisonItems.comparisonItem.push(keyword);
        });

        comparisonItems.category = 0;
        comparisonItems.property = "";

        const queryItem = {
            "exploreQuery": "date=today%205-y",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        };

        const widget = document.getElementById("googleTrendsWidget");

        // does google trends render?: handling
        const widgetMutationObserver = new MutationObserver(didGoogleTrendsLoad);

        function didGoogleTrendsLoad(mutationList, observer) {
            mutationList.forEach((mutation) => {
                setTimeout(() => {
                    if (document.querySelector("[id^='trends-widget-']").attributes.style === undefined) {
                        d3.select("#googleAnchor")
                            .select("#googleTrendsWidget")
                            .remove();

                        if (document.querySelector(".iFrameError") === null) {
                            d3.select("#googleAnchor")
                                .append("div")
                                .attr("class", "iFrameError")
                                .text("Sorry, your browser settings does not allow the embedded trends to render. " +
                                    "It seems to depend on browser privacy settings (\"Do not Track\" or Cookies). " +
                                    "A reload after lowering the privacy settings resolved the issue. " +
                                    "Alternative: Click on the button below to open the original Google Trends page " +
                                    "in a new tab.");
                            d3.select(".iFrameError").lower();
                        }
                    }
                }, 2000);
            });
        }

        widgetMutationObserver.observe(widget, {childList: true, subtree: false});

        /**
         * GoogleTrends API call
         * @param {object} widget html anchor element
         * @param {object} comparisonItems contains time and keywords
         * @param {object} queryItem contains time and API link
         */
        trends.embed.renderExploreWidgetTo(widget, "TIMESERIES", comparisonItems, queryItem);

        d3.select(".googleTrendsNewWindow")
            .on("click", function () {
                if (compareList.length === 0) {
                    $("#comparisonModal").modal('toggle');
                } else {
                    let googleTrendsReplacementURL = "https://trends.google.de/trends/explore?date=today%205-y&q=" + compareList.toString();
                    window.open(
                        googleTrendsReplacementURL,
                        "_blank"
                    );
                }
            });
    }

    // Data Table section

    /**
     * Pagination of Data Table
     * Reference https://dc-js.github.io/dc.js/examples/table-pagination.html line 68++
     * rewrite from ternary operator for better understanding & readability
     */
    let dataTablePageSize = 10;
    let dataTablePageStart = 0;
    let dataTablePageEnd = 9;
    let sizeFilteredDataset = fullDatasetGroup.value();

    function update_offset() {
        sizeFilteredDataset = fullDatasetGroup.value();

        // if there is enough data for the full slice, set end to the full size; else set end to fit the last datapoint
        if (dataTablePageStart + dataTablePageSize > sizeFilteredDataset) {
            dataTablePageEnd = sizeFilteredDataset;
        } else {
            dataTablePageEnd = dataTablePageStart + dataTablePageSize;
        }

        // if the offset moved out of the dataset, set the offset to the last datapoint
        if (dataTablePageStart >= sizeFilteredDataset) {
            dataTablePageStart = Math.floor((sizeFilteredDataset - 1) / dataTablePageSize) * dataTablePageSize;
        }

        // ensure the lowest data index to start the table with is 0
        if (dataTablePageStart < 0) {
            dataTablePageStart = 0;
        }

        dcDataTable.beginSlice(dataTablePageStart);
        dcDataTable.endSlice(dataTablePageStart + dataTablePageSize);
        }


        /**
         * Pagination controls and show which page, slice of dataset
         */
        function display() {
            sizeFilteredDataset = fullDatasetGroup.value();

            // if there is enough data for the full slice, set end to the full size; else set end to fit the last datapoint
            if (dataTablePageStart + dataTablePageSize > sizeFilteredDataset) {
                dataTablePageEnd = sizeFilteredDataset;
            } else {
                dataTablePageEnd = dataTablePageStart + dataTablePageSize;
            }

            // pagination controls
            // empty dataset and zero index handling
            d3.select("#begin")
                .text(dataTablePageEnd === 0 ? dataTablePageStart : dataTablePageStart + 1);

            d3.select("#end")
                .text(dataTablePageEnd);

            // disable buttons, when the previous / next pages does not exist
            d3.select("#previousPageButton")
                .attr("disabled", dataTablePageStart - dataTablePageSize < 0 ? "true" : null);
            d3.select("#nextPageButton")
                .attr("disabled", dataTablePageStart + dataTablePageSize >= sizeFilteredDataset ? "true" : null);

            // if filtered, show total size never the less
            d3.select("#size").text(sizeFilteredDataset);
            if (sizeFilteredDataset !== fullDataset.size()) {
                d3.select("#totalsize").text(" filtered (total: " + fullDataset.size() + ")");
            } else {
                d3.select("#totalsize").text("");
            }
        }

        // next Page button
        function nextPage() {
            dataTablePageStart += dataTablePageSize;
            update_offset();
            dcDataTable.redraw();
        }

        d3.select("#nextPageButton")
            .on("click", function () {
                nextPage();
            });

        // previous Page button
        function previousPage() {
            dataTablePageStart -= dataTablePageSize;
            update_offset();
            dcDataTable.redraw();
        }

        d3.select("#previousPageButton")
            .on("click", function () {
                previousPage();
            });
        // end of pagination reference

        // DataTable generation
        dcDataTable
            .dimension(dimGithubStarsForDataTable)
            .size(Infinity)
            .showSections(false)
            .columns([
                // compare checkbox + package name
                {
                    label: "Select &#x2264; 3",
                    format: d => (
                        `<input type="checkbox" id="checkbox-${d.name}" value="${d.name}">` +
                        `<label for="checkbox-${d.name}"><strong>${d.name}</strong></label>`
                    )
                },
                // GitHub repo link column
                {
                    label: `<i class="fab fa-github-square" aria-hidden="true"></i>
                    <span class="sr-only">Column for GitHub repository links</span>`,
                    format: d => {
                        if (d.githubLink === "not provided") {
                            return (`<i class="far fa-question-circle" aria-hidden="true"></i>
                                 <span class="sr-only">Link to repository not provided</span>`);
                        } else {
                            return (`<a href="${d.githubLink}" target="_blank">
                                 <i class="fas fa-external-link-square-alt" aria-hidden="true"></i>
                                 <span class="sr-only">Link to repository</span>
                                 </a>`);
                        }
                    }
                },
                {
                    label: "stars",
                    format: d => d.githubStarsCount
                },
                {
                    label: "keywords provided",
                    format: d => {
                        let tableKeywords = [];
                        d.keywords.forEach(keyword => {
                            tableKeywords.push(" " + keyword);
                        });
                        return tableKeywords;
                    }
                }
            ])
            .order(d3.descending);

        // add Compare List checkboxes
        dcDataTable
            .on("renderlet", function () {
                d3.selectAll(".dc-table-column > input")
                    .each(function () {
                        if (compareList.includes(this.value)) {
                            this.checked = true;
                        }
                    });
                d3.selectAll(".dc-table-column > input")
                    .on("click", function () {
                        updateCompareList(this.value);
                    });
            });

        // add pagination
        dcDataTable
            .on("preRender", update_offset)
            .on("preRedraw", update_offset)
            .on("pretransition", display);


        /**
         * Dataset size vs total size and reset button
         * Reference: http://dc-js.github.io/dc.js/stock.js line 426++
         */
        dcVisCounter
            .crossfilter(fullDataset)
            .groupAll(fullDatasetGroup)
            .html({
                    some:
                        "<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records " +
                        "<button id='resetAllButton'>Reset All</button>",
                    all: "All <strong>%total-count</strong> records selected. " +
                        "<button id='resetAllButton' disabled='true'>Reset All</button>",
                }
            )
            .on("renderlet", function () {
                d3.select("#resetAllButton")
                    .attr("class", "btn")
                    .on("click", function () {
                        resetAllFilters();
                    });
            });

        /**
         * For ResetAll Button
         * Reset filters and compare list
         */
        function resetAllFilters() {
            dc.filterAll();

            compareList = [];
            updateCompareList();

            document.querySelectorAll(".textSearchContainer input")
                .forEach(d => d.value = "");

            resetKeywordSlider();

            dc.redrawAll();
        }

        /**
         * text filter on name, owner, keyword, filters on packages containing string sequence
         */
        searchByName
            .dimension(dimNameForTextSearch)
            .placeHolder("name");

        searchByRepoOwner
            .dimension(dimGithubUser)
            .placeHolder("owner");

        keywordPackageSearch
            .dimension(keywordsProvidedTextSearch)
            .placeHolder("keyword");

        /**
         * Row chart packages vs star-ranges
         */
        dcStarsRangeRowChart
            .dimension(dimStarsRange)
            .group(groupStarsRange)
            // ordering by hand due to missing y axis on row charts class
            .ordering(d => {
                if (d.key === "stars not provided") return 7;
                else if (d.key === "zero stars") return 6;
                else if (d.key === "1 to 10 stars") return 5;
                else if (d.key === "10 to 100 stars") return 4;
                else if (d.key === "100 to 1,000 stars") return 3;
                else if (d.key === "1,000 to 10,000 stars") return 2;
                else if (d.key === "10,000 to 100,000 stars") return 1;
                else if (d.key === "more than 100,000 stars") return 0;
            })
            .ordinalColors(["#00FF7B", "#00EC8E", "#00D9A1", "#00C6B4", "#00B4C6", "#00A1D9", "#008EEC", "#007BFF"])
            .elasticX(true)
            .title(d => {
                if (d.key === "stars not provided") {
                    return d.value + " packages did not provide GitHub information.";
                } else {
                    return d.value + " packages of the selection got " + d.key;
                }
            })
            .turnOnControls();

        /**
         * Multiple keyword selector
         * filter keyword list by threshold of packages containing keyword
         * Reference: https://dc-js.github.io/dc.js/examples/adjustable-threshold.html, line 105++
         */
        d3.select("#keywordSliderRange").on("change", function () {
            updateKeywordSlider(this.value);
        });

        function updateKeywordSlider(slideValue) {
            let sliderDiv = document.getElementById("sliderValue");
            sliderDiv.innerHTML = slideValue;
            dcKeywordSelector
                .filterDisplayed(d => {
                    if (dcKeywordSelector.filters().includes(d.key)) {
                        return d.value;
                    } else if (d.value >= slideValue) {
                        return d.value;
                    }
                });
            dc.redrawAll();
        }

        function resetKeywordSlider() {
            const keywordSliderDefault = document.getElementById("keywordSliderRange").defaultValue;
            document.getElementById("keywordSliderRange").value = keywordSliderDefault;
            updateKeywordSlider(keywordSliderDefault);
        }

        dcKeywordSelector
            .dimension(keywordsProvided)
            .group(keywordsIndex)
            .title(d => d.key)
            .multiple(true)
            .controlsUseVisibility(true)
            .filterDisplayed(d => d.value > 50)
            .turnOnControls()
            .on("renderlet", d => {
                d.select("input[type='reset']")
                    .attr("class", "btn")
                    .on("click", function () {
                        resetKeywordSlider();
                        dcKeywordSelector.filterAll();
                        dc.redrawAll();
                    });
                if (!keywordsProvided.hasCurrentFilter()) {
                    d.select("input[type='reset']")
                        .attr("disabled", "true");
                }
            });

        //Final dc.renderAll() -> end of dc part, renders all tables
        dc.renderAll();
    }
