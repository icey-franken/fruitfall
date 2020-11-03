# MVP List


### Thought splurge

critical -> important -> optional -> ignore

Fallingfruit.org has the following navlinks:

## Signup/Login (critical)
- obvious must have
- users are not required to sign up to view things, but in order to comment/add locations/whatever you gotta be logged in.
- basically - all get routes are not protected; all post routes are protected
- note that signup form has additional options (email alerts, edit map anonymously) and a "foraging range" (to determine which email alerts are relevant)

## [Map](map_feature.md) (CRITICAL)
- google maps api... duh
- header has the following options:
  - address input
  - "zoom to me" button (req. user location)
  - filter by edible type
  - three checkboxes
    - "tree inventories" (specific kind of "foragable")
    - "invasive" (show... invasive species)
    - "labels" (shows name of forageable next to pin)
- the map itself:
  - on clicking a single pin a label box is opened up containing info (from add location form)
    - view reviews; add review
    - view info; edit info
    - report link
    - copy link to pin
    - zoom to pin
    - view pin in street view
  - right-click on map to add location
  - large numbers of pins are clustered into clickable with size based on number of pins - clicking cluster zooms map in on area.

## Add Location (critical)
- allows users to add to the map - key feature. Without this the site is pointless.
- users input:
  - type (dropdown)
  - position (two float inputs or address textarea) - lat/lng from map pin or address
  - name (text input) - not required, but I should source from profile. Randos should not be able to add things bc spam idk
  - description (textarea)
  - season (two dropdown for range, or checkbox for no season)
  - source (dropdown) - public, private, mine, etc.
  - unverified (checkbox) - e.g. have you checked this spot out?
  - have you visited this location? (secondary form - fill out if true. Make this a checkbox that renders the second form if checked)
    - date visited
    - sliders for fruiting status, quality, yield. Slider is actually pretty cool
    - photo upload and caption
  - captcha
  - submit (has checkbox for "create another" which I assume renders a fresh form)

## Activity (important)
- a log of additions/edits separated by day and sorted by most recent containing links to the map location
- very ugly and not interactive

## Data (important)
- raw data: gives links to the source data files
- summary of sources: contains a searchable, sortable list of ~2000 different edibles with common name, scientific name, wiki and usada link, and number of locations each edible can be found at
- From page: "The database currently contains 2,780 different types of edibles (most, but not all, are plant species) distributed over 1,444,463 locations. For each type, the following table lists common names, scientific names, links to outside references, and total count."

## About (optional)
- about the project; about their staff; company info
- this is another place to plug myself if I want, or just don't include at all
- it would be nice to include the [ethics of urban foraging](https://docs.google.com/document/d/1SupIGQKC5Vgi3VYkdIQc05y_S7jSoZ4RTS-CzwlEAMY/edit) here

## links to social media (IGNORE)
- these could be links to my pages instead
- or put links to my stuff in the footer
- in either case... don't stress about these
- effectively... IGNORE

## language selection (IGNORE)
- lol... I can't translating a darn thing. IGNORE
