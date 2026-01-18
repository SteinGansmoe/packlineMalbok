# Packline Malbok Internal Tool

## Packline Malbok has been changed: 

 - Only authenticated users can read/write in application. 


## User Flow: 

1. Make selection (Home)
 - Display **only makes that have fitments** (derived from DB)
 - UI: Logo grid tiles + make name
 - Include **search** to filter makes quickly

2. Make details page
 - Header: Selected make + back button
 - Display **fitments for that make immediately** in a card/grid view
 - Above grid: 
  - **Model filter** (dropdown or chips, derived from returned cars)
  - Optional: Year filter later (Might not be relevant)

3. Fitment card content
 - Car: model + year + roof
 - Box model
 - Measurement profile label + cut kind
 - CC/CB + front/back (include notes)
 - Precut available indicator (from measurement profile)



Implementation Guide: 

To support Option 2 cleanly, you want your query to return fitments joined with:

car fields (make/model/year/roof)

box model name

measurement profile fields (label/cut_kind/precut_available)

Then:

Build the model filter options from the returned car list (unique model+year combos)

Filter in-memory for fast UI

