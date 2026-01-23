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

## Routes
We use React Router here. 

- ```/login```
- ```/```
- ```/make/:make```
- ```/admin```

For dedicated car view: 

 - ```/make/:make/car/:carId```

## Component Structure
```App.tsx```
 - Session gate + role fetch (Completed)
 - If not logged in routes only show ```/login```
 - If logged in render router

 ```pages/MakePickerPage.tsx```
  - Fetch "available makes" (derived from DB)
  - Search filter (client-side)
  - Grid of make tiles
  - Clicking tile navigates to ```/make/Tesla``` etc.

  ```pages/MakeFitmentsPage.tsx```
   - Reads ```make``` from useParams()
   - Fetch fitments for that make (joined)
   - Build model filter options from returned data
   - Render fitment cards grid

   ```components/MakeTile.tsx```
   - Logo + name + accessibility
   
   ```components/FitmentCard.tsx```
   - Displays fitment info consistently


   ## Data approach (important)
    - For MakePicketPage: query fitments joined with cars and derive unique makes
        - Can create a view for this later. 

    

    Fortsett med CreateFitmentPage i morgen: 

     - Finn god user flow først og fremst. 
     