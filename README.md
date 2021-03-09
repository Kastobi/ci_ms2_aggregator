# MS2 – Data aggregator on frontend libraries

# ToDo pre Submission
- testing
- readme
- favicon?


![opener]()

[The website](https://apometricstk.github.io/ci_ms2_aggregator/) is intended to help front-end development students to 
  compare the popularity (depicted by GitHub stars and Google Trends) of different JavaScript packages  and keywords.

# Table of Contents
1. [UX](#UX)
2. [Features](#Features)
3. [Technologies](#Technologies Used)
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

The user


#### Mobile wireframe
![wireframes mobile](/readmeAssets/Mobiles.png)

#### Desktop wireframe
![wireframes bigger as mobile](/readmeAssets/Desktop.png)

### Surface

As preset, I embed the well known Google brand colors (via the Google Trends chart).
Without customization of inputs many browsers use blue as default color.
To stay in the range but clearly differentiate from Googles content, I picked green for my main color and used a
gradient to blue from Google and the browsers for my gradient.

![google colors](/readmeAssets/baseColors.jpg)

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
    
## Technologies Used

#### [HTML](https://en.wikipedia.org/wiki/HTML)
- for the main pages

#### [CSS](https://en.wikipedia.org/wiki/CSS)
- for everything styling related

##### [Bootstrap](https://getbootstrap.com/)
- for responsive layout and modal

##### [FontAwesome](https://fontawesome.com/)
- for link symbols

#### [JavaScript](https://en.wikipedia.org/wiki/JavaScript)

##### [jQuery](https://jquery.com/)
- as dependency of Bootstrap modal

##### For Charting and Data handling
- [D3](https://d3js.org/)
- [crossfilter](http://crossfilter.github.io/crossfilter/)
- [dc.js](https://dc-js.github.io/dc.js/)

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

#### HTML Validator
The index.html was validated by [HTML validator](https://validator.w3.org/).

!!! BEFORE SUBMISSION

#### CSS Validator
The styles.css was validated by [jigsaw validator](https://jigsaw.w3.org/css-validator/).

#### JS Validator
The script.js was validated by []().

!!! BEFORE SUBMISSION

### Manual testing

#### Chrome exclusive, deployed page

### Functionality testing

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
