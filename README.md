# MS2 – Data aggregator on frontend libraries

# ToDo pre Submission
- testing
- readme

![opener]()

[The website](https://apometricstk.github.io/ci_ms2_aggregator/) is intended to help front-end development students to 
  compare the popularity (depicted by GitHub stars and Google Trends) of different JavaScript packages  and keywords.

# Table of Contents
1. [UX](#UX)
2. [Features](#Features)
3. [Technologies](#Technologies)
4. [Testing](#Testing)
5. [Deployment](#Deployment)
6. [Credits](#Credits)
 
## UX

### Strategy & Scope

A selection of the major objectives and selected ways to achieve them in form of user stories and conclusions.

As a…

#### front-end development student...
1. I want to learn the best technology to foster my career. I have difficulties to decide which is the most relevant 
   technology, because I lack the experience to evaluate the quality of software libraries. 
   -> Depended on Experience of others
   
2. I want to use the experience of many professionals (not just one subjective opinion) to create a shortlist of 
   libraries to research. 
   -> GitHub Stars as metric

3. I want to get a feeling about the different trends of the libraries on my shortlist, because I don't want to 
   accidentally select the technology, which will be obsolete before I get relevant experience with it. 
   -> Google Trends timeline
   
4. I don't want to miss the library which is a perfect fit for my needs, because I did my research only on the superstar 
   of the bunch. 
   -> Selection and comparison by tags/keywords

5. I have to do research on my shortlist, to find my best fit. The evaluation of the relevance in my region is possible 
   with Google Trends, the technical research is best done on the repositories. 
   -> Include Links to both
   
### Structure & Skeleton

The value for the user is mainly in the embedded Google Trends chart, and the filterable data table. So both of them
are presented at the top of the page. The control elements connecting them are anchored between them.

On bigger screens, the main filter elements are placed next to the table, on mobiles they switch below the table, to
prevent user-irritation (clear binding to the table, not the trends-chart) and maintain the table in a readable width.

The feature to search all the keywords present in the dataset is combined with a filter-slider, to prevent overloading
the tagcloud to an unusable list (the 4,000 packages in the dataset got over 6,000 unique keywords (allready normalized 
to lowercase)), but maintain the usability of the feature.

The about section was positioned beneath the main data to hook the user with the most asked question ("Angular, React or
Vue?") and guide to critical thinking about the provided data and further research on package use.

The disclaimer and contacts sections are of minor value for the user, but the disclaimer and contacts should be
presented on the same page, as the used data and therefore positioned at the bottom of the page.

#### Mobile wireframe
![wireframes mobile](/readmeAssets/Mobiles.png)

#### Desktop wireframe
![wireframes bigger as mobile](/readmeAssets/Desktop.png)

### Surface

As preset, I embed the well known Google brand colors (via the Google Trends chart).
Without customization of inputs many browsers use blue as default color.
To stay in the range but clearly differentiate from Googles content, I picked green for my main color and used a
gradient to blue from Google and the browsers for my gradient.

![google colors](/readmeAssets/googleColors.jpg)

![color palette](/readmeAssets/baseColors.jpg)

![gradient colors](/readmeAssets/gradientColors.jpg)

---

## Features

### Existing Features

### Meta

- The navigation bar allows to scroll to the relevant part of the website all time.

- The about text introduces users to different approaches to evaluate libraries and links to more content about it. 

- The disclaimer informs users on the unaffiliated status of the project and its educational purpose.

- The contact links enable the users to get in touch with the author.

- The charts with the exception of the Google chart (embedded, no public API available) interact with each other
  (selecting a filter applies the filter to the shared dataset).

### Google Trends chart

- On the first load of the page the actual comparison which led to the project idea is generated to promote the feature.

- If a problem with browser settings (privacy, cookies - see known bugs/features left to implement) appears, the user is
informed, and a workaround is shown.

- A button to open Google Trends (preloaded with selection) in a new tab is presented, for individual research
on users' selection.

- The chart shows the trends of the worldwide search terms (the package names selected by the user) of the past 5 years.
The user can evaluate the popularity of the different packages in relative terms based on it.

### Package table

- On the first load of the page the most popular packages (based on GitHub stars provided by cdnjs) are listed with a
  link to their project page, their actual GitHub stars and the keywords used to tag the packages.
  
- A pagination is used to maintain the overview for users and prevent a list of thousands on small screens. Two buttons
  let the user turn the pages.
  
- A checkbox allows the user to select a package for GoogleTrends.

- As soon as packages are selected, a user can remove them by clicking on the generated button labeled with the name of
  the package, remove all by clicking a reset button or reload the Google Trends chart by clicking the "Show me the 
  trends!"-Button.
  
- If the user tries to select more than the intended 3 packages, a modal informs the user to just select up to 3 
  packages.
  
### Data Counter

- The data counter below the chart displays the total records, the sample size and contains a button to reset filters.

### Text Search

- A set of freetext inputs enables users to search by the package name, the owner and a specific keyword by text entry.

### Range row chart

- A row chart differentiates the selection by popularity based on GitHub stars. A click on a row filters on the selected
  range (multiple ranges selectable).

- defined segments 
    - more than 100,000 stars
    - 10,000 to 100,000 stars
    - 1,000 to 10,000 stars
    - 100 to 1,000 stars
    - 10 to 100 stars
    - 1 to 10 stars
    - zero stars
    - stars not provided

- The segments were chosen this way to fulfill the different criteria of users. 
    - compare unicorns like Facebooks React to Googles Angular
    - compare niche packages like plugins for specialised use-cases
    
### Multiple keyword selector

- The multiple keyword selector lists all keywords used to tag packages in the selection, normalized to lowercase.

- The thousands of packages in the unfiltered dataset contain a multiple of almost 1,5 unique (lowercase) keywords.
  To maintain a processable amount of useful keywords, a range slider filters the keywords based on appearance.
  
- Checkboxes filter the selection to contain one of the selected keywords. The selected keywords are not filtered the
  slider.

### Features left to Implement
- add a Backend to prevent loading of full dataset ressources on page load and speed up TTI
- prevent layout shifting due to embed/chart generation

- Customization of checkboxes and range-input for uniform cross-browser look.
- Dynamic data table pagination, depending on viewport size/user input (Now: Table size 10 packages hardcoded)
- Add a widget with all active filters (for onclick removal) (Now: Find specific chart/filter or reset all)

- Google Trends
    - Find alternative way to implement Google Trends (Now: Cross-Site-Origin Error if no-track / cookies missing/
      blocked;
      Google seems to set x-frame-options: sameorigin on their embedded response, if Googles cookies are missing.
      [Reference](https://bugzilla.mozilla.org/show_bug.cgi?id=1624914)
    - Reverse engineer their whole embed API to make all parameters accessible for users (high risk to break, if 
      API change) 

- Keyword features
  - Build a dataset of keyword-counts and 
    - filter via range checkboxes/chart (analog GitHub star partials) or two inputs-slider (Now: slider)
    - set default value of keyword cloud based on selection (Now: 50 packages hardcoded)
  - Alternative display of keywords, tagcloud by popularity (Now: alphabetical list)
  - Show packages which contain all selected keywords (Now: packages which contain one of selected keywords)
  - Rewrite filter on text search widget to allow multiple keywords
  - Highlight keywords matching the keyword text filter
    
## Technologies

#### [HTML](https://en.wikipedia.org/wiki/HTML)
- for the main pages

#### [CSS](https://en.wikipedia.org/wiki/CSS)
- for everything styling related

##### [Bootstrap](https://getbootstrap.com/)
- for responsive layout and modal

##### [FontAwesome](https://fontawesome.com/)
- for link symbols

##### [Google Font *Lato*](https://fonts.google.com/specimen/Lato)
- for Lato for a clean readable impression

#### [JavaScript](https://en.wikipedia.org/wiki/JavaScript)

##### [jQuery](https://jquery.com/)
- as dependency of Bootstrap modal

##### For Charting and Data handling
- [D3](https://d3js.org/)
- [crossfilter](http://crossfilter.github.io/crossfilter/)
- [dc.js](https://dc-js.github.io/dc.js/)

##### [Jasmine](https://jasmine.github.io/)
- for tests on load process

#### [Git](https://git-scm.com/) / [GitHub](https://github.com)
- for version control
- for deployment

#### [gitpod](https://gitpod.io)
- as IDE

#### [Pycharm](https://www.jetbrains.com/pycharm/)
- as IDE after gitpod was down way to frequently

#### [code institute gitpod template](https://github.com/Code-Institute-Org/gitpod-full-template)
- as a starter for the gitpod environment

#### [code institute readme template](https://github.com/Code-Institute-Solutions/readme-template)
- as a starter for the readme.md

#### [coolors](https://www.coolors.co)
- for the color scheme

## Testing

### Validators

Validators were used by copy and pasting the code into validators.
- Strg+A
- Strg+C
- Strg+V

Validation was used on regular basis while developing and before submission.

#### HTML Validator
The index.html was validated by [HTML validator](https://validator.w3.org/) and passed without errors.

#### CSS Validator
The styles.css was validated by [jigsaw validator](https://jigsaw.w3.org/css-validator/) and passed without errors.

#### JS Validator
The script.js was validated by [JSHint](https://jshint.com/).

As it returned warnings the following options were set;
- esversion: 8 (to use "async function"; coverage per caniuse.com: 92,69%, assumption: front-end devs will use 
  up-to-date browsers)
- globals: d3, crossfilter, dc, trends, console (first ones imported via index.hrml script tags, console just error log)

No warnings remained.

### Manual testing

A console warning derived from a removed d3 color scheme, supported by dc for backward compatibility, was removed by 
selecting another default color scheme (script.js line 113).
![console warning](/readmeAssets/consoleWarning.jpg)

#### Test cases

1. Responsiveness
    - Procedure    
        1. Open Homepage
        2. Left click on the page and open Dev Tools (Strg + Alt + i)
        3. Toggle device toolbar
        4. Resize with from wide to narrow
    - Expected
        - Layout aligns according to wireframes
        - Charts redraw after resizing
        - No Scroll bars (Exception: table, as defined in wireframe) on page elements
        - No breaking of the layout
    
2. Usability and Functionality
    1. Nav
        - Procedure
            1. Scroll the page down, beginning top, observe
            2. For every nav button: click, observe
        - Expected
            - Navbar sticks to top and enables user to move to distinct location on page.
            - Every button moves the user to the according section of the page.
    2. Filters
        1. Filtering 
            - Procedure        
                1. Apply a filter from every filtering element
                    1. the text filters (name, owner, keyword); enter a string
                    2. popularity row chart; click on a row
                    3. multiple keyword range; select some checkboxes
                2. Audit expected filter behaviour
                    1. Modify text input
                    2. Click on the same row
                    3. Click on "reset" button of multiple keyword selector
                3. Audit expected behaviour
                4. Click on "Reset All"
                    1. Audit expected behaviour
            - Expected behaviour
                - Filter behaviour
                    - Text filters
                        - The filtered table column contains only elements, with the lowercased input chars in given
                        order, without other chars in between. Before and after the sequence, other chars are allowed.
                            - name: filters first table column (package name)
                            - owner: filters second table column, hover over link symbol to compare string between the 
                            last two slashes, appearing in bottom left of the browser
                            - keyword: filters last table column (keywords provided)
                        - Adding/Removing chars to inputs modifies filters accordingly
                    - Popularity filter
                        - The stars column of the table contains only elements, described by the label of the row.
                            - Exception: "stars not provided": 0 is allowed
                        - The clicked row is highlighted
                        - Another click on selected row removes highlight and filter
                    - Multiple keywords range
                        - The last table column (keywords provided) contains at least *one* of the keywords selected by
                        the checkboxes.
                        - If no checkbox is checked, "reset" button is disabled.
                        - Click on "reset" button removes this filter. All other filters still apply.
                    - Every adding / removing filter updates the connected elements, especially the table and the 
                    counter next to the "Reset All" button.
                - "Reset All" behaviour
                    - All filters are dropped, full dataset is displayed by the elements.
                    - "Reset All" button is disabled
        2. Subfiltering multiple keywords
            - Procedure
                1. Moving the slider "narrow down by popularity" to the far right, observe.
                2. Moving the slider to the far left, observe.
            - Expected Behaviour
                - right: fewer keywords displayed, sentence below slider contains bold "100".
                - left: more keywords displayed, sentence below slider contains bold "1".
    3. Google Trends Comparison
        1. Selection        
            - Procedure
                1. Click on up to 3 checkboxes in the table, observe
                2. Hover over appearing button, observe 
                3. Click on one of the buttons, observe
                4. Try to check 4 checkboxes, observe
            - Expected behaviour
                1. Buttons with package name appear
                2. Text is crossed out
                3. The checkbox of the package named is unchecked, button disappears.
                4. A modal appears, informing you to check 1-3 boxes, just 3 boxes are checked.
        2. Comparing
            - Procedure
                1. With up to 3 boxes checked, click on "Show me the trends!"
                2. With up to 3 boxes checked, click on "Google Trends in new tab"
                3. With 0 boxes checked, click on "Google Trends in new tab"
            - Expected behaviour
                1. The trends chart updates accordingly
                2. A Google Trends tab opens, preloaded with checked search-terms.
                3. A modal appears, informing you to check 1-3 boxes.
    4. Data table
        - Procedure
            - "Next Page" and "Previous Page" buttons click
            - The GitHub link symbol of a button click
        - Expected behaviour
            - The table pages turn accordingly, data updates in the table and next to the buttons
            - The correct GitHub page opens in a new tab

    5. About Section
        - Procedure
            - Click every link
        - Expected behaviour
            - The link clicked opens in anew tab
    6. Contacts footer
        - Procedure
            - Click the contacts symbols
        - Expected behaviour
            - The authors contact pages opens a in new tab
    7. General
        - Procedure
            - All buttons were hovered
        - Expected behaviour
            - If not disabled, the color changes
    
#### Chrome exclusive, deployed page

### Automated testing

[The testing site](https://apometricstk.github.io/ci_ms2_aggregator/specrunner.html) includes basic tests on correct
import of font, stylesheets, libraries and the loading and processing of the data.

![Jasmine specrunner](/readmeAssets/jasmineBasics.jpg)

### User-Story verification

#### front-end development student

### Slack review
The project was posted to Slack the Code Institute community channel peer-code-review for different pairs of eyes.

### Readme
Readme was observed on GitHub. All links were clicked.

## Deployment
The relevant files for deployment of the project are

The easiest way (but not the tiniest in terms of filesize - the download includes the development gitpod files) is to click on "Code" on the top of this page (top right above the file list) and on "Download zip".  
Afterwards extract the zip (most OS include a packaging program for it, just right click on it) into the required folder (read below).

### Local
For local use, download the files and the folder, put them (or extract) into the same directory and open the **index.html** file with your browser.

### Deployed / Hosted
For deployed use, download the files and the folder, put/upload/extract them into the folder advised by your hoster (e.g. "www", but it depends - check back with your hoster / the documentation!).  
Be cautious not to alter the file hierarchy.

### with GitHub pages
If you are logged into your GitHub Account (if not: Sign up - its free!) just click on "Fork" on the top right of this page.
Afterwards in the "Settings" (top menu, right beyond the name of the repository) menu, go to "Options" (top menu item), and afterwards scroll down to "GitHub Pages", select "Master branch" as source and click "Save".
To get to the deployed site afterwards, click on the link.  
Further [documentation](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages)

### this actual deployment
The content was deployed via GitHub pages by configuring the repository according to the above walkthrough.

## Credits

### Content

#### Data
- [cdnjs](https://cdnjs.com/)

- [GitHub](https://github.com)

- [Google](https://trends.google.com/)

#### Components
- Browser compability verification with [caniuse](https://caniuse.com/)

- [Bootstrap](https://getbootstrap.com/) components
    - Layout system / grid
    - Navbar
    - Button
    - Modal

### Media
* The Font Awesome symbols were made by [Font Awesome](https://fontawesome.com/).

* The first readme screenshot was taken with [ami.reponsive](http://ami.responsivedesign.is/)

* The color palettes screenshots were taken with [coolors.co](https://coolors.co/)

* The favicon was generated with [favicon.ico and app icon generator](https://www.favicon-generator.org/)

* The wireframes were drawn with [Balsamiq](https://balsamiq.com/)

### Acknowledgments
* My mentor Brian Macharia for his support and feedback.

* The Code Institute slack community for their support.
