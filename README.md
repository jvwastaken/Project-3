<div align='center'>
<h1 align='center'>Project 3: Zombie Apocalpyse</h1>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#About">About</a></li>
    <li><a href="#Sources">Sources</a></li>
    <li><a href="#Troubleshooting">Troubleshooting</a></li>
    <li><a href="#Timeline">Timeline</a></li>
  </ol>
</details>


## About
* <b>Track:</b> Data Visualization 
* <b>Project Summary:</b><br>
    Our project aims to create a data visualization model to simulate the spread of a zombie apocalypse, using the COVID-19 pandemic as a proxy for the transmission dynamics of a viral outbreak. We will map the spread from the initial outbreak to its peak and identify the safest states based on the distribution of military bases, gun sales, and hospitals.
- <b>Objectives:</b> <br>
    - Simulate Virus Spread: 
        - Utilize COVID-19 data to model the spread of a hypothetical zombie virus, tracking infection rates and geographic spread over time. 
    - Identify Safe States: 
        - Map key locations such as military bases, gun sales by state, and hospitals to determine which states are potentially the safest.


## Sources
### COVID Data - Stephen
1. Data was retrieved from: 
  * [World Health Organization](https://data.who.int/dashboards/covid19/cases?n=c).
  * [CDC](https://covid.cdc.gov/covid-data-tracker/#maps_positivity-4-week).
  * [NY Times](https://www.nytimes.com/interactive/2021/us/covid-cases.html).
  * Johns Hopkins: [[1]](https://coronavirus.jhu.edu/map.html) & [[2]](https://github.com/CSSEGISandData/COVID-19).
2. Pulled [2020 World Cases](Stephen/johns_hopkins_github_data_pull/covid_cases_2020.ipynb) and [2021-2023 US Cases](Stephen/johns_hopkins_github_data_pull/covid_cases_2021-23_us.ipynb).
3. Updated `02-01-2020` and `03-01-2020` column headers to perform merge across all months in 2020 based on `Region_Country` and `Province_State`
4. Took 2020 World Data and filtered it by US and merged CSVs to create one dataframe
    * [consolidated_covid_data_world2us.csv](Stephen/johns_hopkins_data_merge/consolidated_covid_data_world2us.csv).
    * [consolidated_covid_data_world2us_with_lat_long_.csv](Stephen/johns_hopkins_data_merge/consolidated_covid_data_us_with_lat_long_.csv).
5. Consolidated World and US data across `04-01-2020` thru `03-01-2023` into a single [CSV File](Stephen/johns_hopkins_data_merge/main_covid_cases_2020-2023_merge.csv)
### Hospital Data - Vivian/JV
1. Data was retrieved from [Kaggle](https://www.kaggle.com/datasets).
2. Data cleaning and analyzing was done [here](Vivian/Cleaning_data.ipynb).
3. The cleaned data was exported as a [CSV File](Vivian/Resources/cleaned_hospitals.csv).
4. The CSV File was converted into a [JSON File](Vivian/Resources/cleaned_hospitals.json).
### Gun Sales Data - Sean
1. Data was retrieved from [safehome.org](https://www.safehome.org/data/firearms-guns-statistics/).
2. Data cleaning and analyzing was done [here](Sean/Resources/US_gun_sales.ipynb).
3. Cleaned data was converted into a [CSV File](Sean/Resources/US_gun_sales_data_COMPLETE.csv).
### Military Bases Data - Levi
1. Data was retrieved from [militarybases.com](https://militarybases.com).
2. Data was cleaned and exported as a [CSV File](Levi/military-bases.csv)


## Troubleshooting
- XPert Learning Assisant: for review and correction of code as needed.
- Online Tutoring Sessions: for further assistance in building the code for [Flask](Final_Data/flaskdata/flask_api.py).
- [ChatGPT](https://chatgpt.com/): for review and correction of code as needed.
- [Leaflet Documentation](https://leafletjs.com/reference.html): creating interactive maps.

## Timeline
* [SL] Thu, July 11th - Group 4 Team formed (JV, Levi, Sean, Stephen and Vivian)
* [SL] Thu, July 11th - JV created Project-3 Repo and data responsibilities assigned. 
* [SL] Sat, July 13th at 3:00 PM EST - Pulled 2020 World and 2021-2023 US Covid Cases from Johns Hopkins Github. 
* [SL] Sat, July 13th at 3:35 PM EST - Cleaned Up 2020 csv to have matching column headers to perform merge.
* [SL] Sat, July 13th at 5:23 PM EST - Merged data from 04-01-2020 thru 12-01-2020
* [SL] Sat, July 13th at 6:52 PM EST - Merged World and US data from 04-01-2020 to 03-01-2023
* [SL] Tue, July 16th at x:xx PM EST - Created leaflet map for Covid Spread
* [SL] Thu, July 18th at x:xx PM EST - Worked with Sean to add Gun data to map.
* [SL] Sun, July 21st at 5:29 PM PST- Created new repository to clean CSVs and create SQLite DB.
* [SL] Sun, July 21st at 11:05 PM PST- Removed Int, added primary keys, and created html w/ data from sqlite.