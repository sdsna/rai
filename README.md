# Rural Access Index (RAI)

## SDG Indicator 9.1.1 Rural Access Index

This is the repository for the calculations behind the accessibility indicators for the SDGs by the UN Sustainable Development Center.

To read full methodology, please visit the SDG Transformation Centre website.

The resulting datasets can be downloaded from the SDG Transformation Centre Data Hub at country or urban center scale.

A data visualization is under the viz folder, and published here: https://sdsna.github.io/sdg-accessibility/viz/

The scripts are to be followed in order. Further instructions are provided as comments within each script.

Global-scale raw amenities data are collected from OpenStreetMap and filtered with OsmPoisPbf and the uac_filter.txt query.
Accessibility calculation are computed using the 1_calculateAccess.py script.
If needed, script 1.5_SplitCities.ipynb will produce subsets of the GHS functional urban areas by continent.
Population grids for functional urban areas are extracted from the Global Human Settlement Layer and pre-processed using the 2_extractUA_QGIS.py script, to be run in QGIS.
Accessibility per grid cell (the data used for the visuals in the app) for urban areas globally is computed using the 3_calculatedGridAccess.py script.
While script 3 generates sub-municipal results for each urban center, at the scale of the population grid, script 4_Generalization (continent wise).ipynb produces population-weighted averages for each urban center by continent.
Script 5_Generalization (all cities from separate continent sets).ipynb simply merges together results from script 4.
World countries population-weighted averages are generated, from each urban center, by script 6_Generalization World countries from Cities.ipynb.
Finally, adjustments to the data schema are made with script 7_Schema compatibilization.ipynb
This is a methodology expansion from Nicoletti, L., Verma, T., Sirenko, M. (2022). Disadvantaged Communities Have Lower Access to Urban Infrastructure. Environment and Planning B: Urban Analytics and City Science, 0(0), which code is published in its own repository.
