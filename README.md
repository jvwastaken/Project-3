<a id="readme-top"></a>
<div align='center'>
<h1 align='center'>Project 3: Zombie Apocalpyse</h1>
<h3 align='center'><a href="https://docs.google.com/presentation/d/1WPuGRs6DrmLjjk_hoTF55pQGAKSgOtr8AR3YFLP3EOg/edit?usp=sharing">Slide Deck</a></h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#About">About</a></li>
    <li><a href="#Data-Sources">Data Sources</a></li>
    <li><a href="#Getting-Started">Getting Started</a></li>
    <li><a href="#Acknowledgements">Acknowledgements</a></li>
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

## Getting Started
1. Open **GitBash** (Windows) or **Terminal** (Mac).
2. Install the flask-cors extension by running the following command: `pip install flask-cors`.
3. Run [flask_api.py](Final_Data/flaskdata/flask_api.py) in GitBash/Terminal using the following command: `python flask_api.py`.
    > [!NOTE] 
    > Make sure you are in the file's directory prior to entering the above command.
4. Click the link in the response from GitBash/Terminal: `http://127.0.0.1:5000`
4. Run [index.html](Final_Data/HTML/index.html).


## Data Sources
#### COVID Data - Stephen
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
#### Hospital Data - Vivian/JV
1. Data was retrieved from [Kaggle](https://www.kaggle.com/datasets).
2. Data cleaning and analyzing was done [here](Vivian/Cleaning_data.ipynb).
3. The cleaned data was exported as a [CSV File](Vivian/Resources/cleaned_hospitals.csv).
4. The CSV File was converted into a [JSON File](Vivian/Resources/cleaned_hospitals.json).
#### Gun Sales Data - Sean
1. Data was retrieved from [safehome.org](https://www.safehome.org/data/firearms-guns-statistics/).
2. Data cleaning and analyzing was done [here](Sean/Resources/US_gun_sales.ipynb).
3. Cleaned data was converted into a [CSV File](Sean/Resources/US_gun_sales_data_COMPLETE.csv).
#### Military Bases Data - Levi
1. Data was retrieved from [militarybases.com](https://militarybases.com).
2. Data was cleaned and exported as a [CSV File](Levi/military-bases.csv)


## Acknowledgements
- XPert Learning Assisant: for review and correction of code as needed.
- Online Tutoring Sessions: for further assistance in building the code for [Flask](Final_Data/flaskdata/flask_api.py).
- [ChatGPT](https://chatgpt.com/): for review and correction of code as needed.
- [Leaflet Documentation](https://leafletjs.com/reference.html): creating interactive maps.
- [StackOverflow](https://stackoverflow.com/): for reference to build and correct codes.

<p align="right">(<a href="#readme-top">Back To Top</a>)</p>