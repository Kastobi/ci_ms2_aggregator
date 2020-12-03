// 1x API call result global, stored to prevent further API calls and let user customize output without generating further calls
let cdnjsFullList = null;

document.addEventListener("DOMContentLoaded", initSite);

async function initSite() {
    console.log("DOM fully loaded and parsed");

    cdnjsFullList = await fetchCdnjsLibrariesFullList();

    console.log(typeof(cdnjsFullList));
};


// cdnjs api call with keyword and github values included
async function fetchCdnjsLibrariesFullList() {
        const result = await d3.json("https://api.cdnjs.com/libraries?fields=keywords,github")
            .catch(error => console.log(error));
        return result.results;
    };

