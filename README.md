# Project-3

# Project
* Track: Data Visualization 
* Project Summary: Our project aims to create a data visualization model to simulate the spread of a zombie apocalypse, using the COVID-19 pandemic as a proxy for the transmission dynamics of a viral outbreak. We will map the spread from the initial outbreak to its peak and identify the safest states based on the distribution of military bases, gun sales, and hospitals.
* Objectives: Simulate Virus Spread: 1) Utilize COVID-19 data to model the spread of a hypothetical zombie virus, tracking infection rates and geographic spread over time. 2) Identify Safe States: Map key locations such as military bases, gun sales by state, and hospitals to determine which states are potentially the safest.

# Timeline
* [SL] Thu, July 11th - Group 4 Team formed (JV, Levi, Sean, Stephen and Vivian)
* [SL] Thu, July 11th - JV created Project-3 Repo and data responsibilities assigned. 
* [SL] Sat, July 13th at 3:00 PM EST - Pulled 2020 World and 2021-2023 US Covid Cases from Johns Hopkins Github. 
* [SL] Sat, July 13th at 3:35 PM EST - Cleaned Up 2020 csv to have matching column headers to perform merge.
* [SL] Sat, July 13th at 5:23 PM EST - Merged data from 04-01-2020 thru 12-01-2020
* [SL] Sat, July 13th at 6:52 PM EST - Merged World and US data from 04-01-2020 to 03-01-2023

# Data 
## COVID Data Pull
Project-3/Stephen/johns_hopkins_github_data_pull
1. Pulled 2020 World Cases and 2021-2023 US Cases
    * covid_cases_2020.ipynb 
    * covid_cases_2021_us.ipynb
2. Updated 02-01-2020 and 03-01-2020 column headers to perform merge across all months in 2020 based on Region_Country and Province_State
3. Took 2020 World Data and filtered it by US and merged CSVs to create one dataframe
    * consolidated_covid_data_world2us.csv
    * consolidated_covid_data_world2us_with_lat_long_.csv
5. Consolidated World and US data across 04-01-2020 thru 03-01-2023
    * main_covid_cases_2020-2023_merge.csv

