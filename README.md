# MS2 – Data aggregator on frontend libraries

# ToDo pre Submission
- remove alerts
- testing
- readme


![opener]()

[The website]() is intended to help front-end development students with the comparison of JavaScript, based on popularity
(proxied by GitHub stars and Google Trends) and keywords.

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
technology, because I lack the experience to evaluate the quality of software libraries. -> Depended on Experience of others
   
2. I want to use the experience of many professionals to create a shortlist of libraries to research. -> GitHub Stars as metric

3. I want to get a feeling about the different trends of the libraries on my shortlist, because I don't want to accidentally
select the technology, which will be obsolete before I get relevant experience with it. -> Google Trends timeline
   
4. I don't want to miss the library which is a perfect fit for my needs, because I did my research only on the superstar
of the bunch. -> Selection and comparison by tags

5. I have to do research on my shortlist, to find my best fit. The evaluation of the relevance in my region is possible with
Google Trends, the technical research is best done on the repositories. -> Include Links to both
   
### Structure & Skeleton

![wireframes mobile]()

![wireframes bigger as mobile]()

### Surface

![color palette]()

---

## Features

### Existing Features

### Meta

- The navigation bar allows to scroll to the relevant part of the website all time.

- The about text introduces users to different approaches to evaluate libraries and links to more content about it. 

- The disclaimer informs users on the unaffiliated status of the project and its educational purpose.

- The contact links enable the users to get in touch with the author.

### Google Trends chart

Comparison selection, new tab link

### Package table

repo link, stars, keywords

### Reset filters

### Partials chart

### Text Search

package name, repo owner, specific keyword

### Multiple keyword selector

with slider

### Overview chart

### Features left to Implement
- alternative display of keywords, tagcloud?
- show packages with all selected keywords // additive vs exclusive selection of keywords
- dynamic data table pagination / let user define length of page
- find another way to implement google trends (cross site origin error if no track / cookies blocked, reference
https://bugzilla.mozilla.org/show_bug.cgi?id=1624914)

## Technologies Used



#### [HTML](https://en.wikipedia.org/wiki/HTML)
- for the main pages

#### [CSS](https://en.wikipedia.org/wiki/CSS)
- for everything styling related
##### Bootstrap
##### FontAwesome

#### [JavaScript](https://en.wikipedia.org/wiki/JavaScript)

##### D3
##### crossfilter
##### DC js

#### [Git](https://git-scm.com/) / [GitHub](https://github.com)
- for version control
- for deployment

#### [gitpod](https://gitpod.io)
- as IDE

#### [Pycharm]

#### [code institute gitpod template](https://github.com/Code-Institute-Org/gitpod-full-template)
- as a starter for the gitpod environment

#### [code institute readme template](https://github.com/Code-Institute-Solutions/readme-template)
- as a starter for the readme.md



## Testing

### Validators

#### HTML Validator

#### CSS Validator

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

### Media

### Acknowledgments

* My mentor Brian Macharia for his support and feedback.

* The Code Institute slack community for their support.

* Inspiration was taken from 
