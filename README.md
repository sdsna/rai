# Rural Access Index (RAI)

This is the repository for the calculations behind SDG Indicator 9.1.1 Rural Access Index by the UN Sustainable Development Center.

To read full methodology, please visit the SDG Transformation Centre website.

The resulting datasets can be downloaded from the [SDG Transformation Centre Data Hub](https://github.com/sdsna/sdg-accessibility#:~:text=SDG%20Transformation%20Centre%20Data%20Hub) at [country level](https://sdg-transformation-center-sdsn.hub.arcgis.com/datasets/sdsn::rural-access-index-2022-by-country/about).

A data visualization is under the viz folder, and published [here](https://sdsn.maps.arcgis.com/apps/mapviewer/index.html?panel=gallery&layers=d386abdab7d946aa8b1a0cd11496d91f).

The scripts are to be followed in order. Further instructions are provided as comments within each script.

0. In folder 0.Microsoft, scripts are provided in order to acquire road data from the Microsoft Bing Road Detection Project and process those to produce a rasterized 2km buffer around all roads.
1. In folder 1.OSM, there are scripts to download road data from OpenStreetMap in .osm.pbf format, filter for paved and unpaved and produce rasterized 2km buffers for the two categories.
2. In folder 2.GRIP, scripts are provided to produce a rasterized 2km buffer exclusively around roads classified as all-season.
3. In folder 3.GRUMP_SMOD, instructions for creating a raster differentiating urban and raster using the GRUMP and GHS_SMOD datasets.
4. Folder 4.WorldPop_GEE has code to be run inside Google Earth Engine's native javascript prompt. It puts previous datasets together along with WorldPop data to calculate the final RAI Score by country.
5. Folder 5.Post_Processing adds information to the final result so values can be aggregated by region of income group.

This dataset implements and expands on the most recent official methodology put forward by the World Bank, [ReCAP's 2019 RAI Supplemental Guidelines](https://www.research4cap.org/ral/Workmanetal-TRL-2019-RuralAccessIndexSupplementalGuidelines-ReCAP-GEN2033D-191219-compressed.pdf).
