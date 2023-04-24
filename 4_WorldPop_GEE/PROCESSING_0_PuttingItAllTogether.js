//Access rural land use data
var smod = ee.Image('projects/ee-guilhermeiablo/assets/GRUMP_SMOD_Rural').remap([0],[1],0,'b1');


//Access population data
var worldpop_raw = ee.ImageCollection("WorldPop/GP/100m/pop").filterDate('2020');
//This is composed of several images, one for each country, so those have to be mosaicked
var worldpop = worldpop_raw.select('population').mosaic();
//And the projection has to be set as it's lost in the process of mosaicking
worldpop = worldpop.setDefaultProjection(worldpop_raw.first().projection());
//Reduce resolution by two-fold (original pixel is 92.76624203150153m)
var projectionAt200 = worldpop.projection().atScale(185.53248406300306);
var worldpopAt200 = worldpop.reduceResolution({
  reducer: ee.Reducer.sum().unweighted(),
  maxPixels: 1024
}).reproject({
  crs:projectionAt200
});
//Map.addLayer(worldpopAt200,{},'pop200');


//Access the innaccessibility factors
//1 - PRECIPITATION

var era = ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR")
                .filter(ee.Filter.date('2022-01-01', '2022-12-31')).sum();
var erafill = ee.ImageCollection("ECMWF/ERA5/MONTHLY").filter(ee.Filter.date('2020-01-01', '2020-12-31')).sum();
var rainfill = erafill.select(['total_precipitation']);
var rain = era.select(['total_precipitation_sum']);
var rain = rain.unmask(rainfill);
Map.addLayer(rain,{},'rain');


print('Precipitation Native Resolution:', era.projection().nominalScale());

//Maybe resample to make it 200m?

//function resample(image) {
//  return image.resample('bilinear').reproject({
//    crs:worldpopAt200.projection().crs(),
//    scale: worldpopAt200.projection().nominalScale()
//  })
//}


//2 - SLOPE (MAP SLOPE FUNCTION OVER COLLECTION)
//Access the raw DEM from Copernicus
var dem = ee.ImageCollection('COPERNICUS/DEM/GLO30');

//Set up a function to calculate the slope in every image of the collection
function makeslope(image) {
  var elevation = image.select('DEM');
  var slopes = ee.Terrain.slope(elevation);
  return slopes;
}
//Apply function in all images and get the median mosaic
var slope = dem.map(makeslope).median();
//Reset the projection as it's lost in the process of mosaicking
slope = slope.setDefaultProjection(dem.first().projection());
//Reduce resolution to 200m so it's identical do population data
var slopeAt200m = slope.reduceResolution({
  reducer: ee.Reducer.mean(),
  maxPixels: 1024
}).reproject({
  crs:projectionAt200
});

//Map.addLayer(slopeAt200m,{},'slope200');




var unpavedBuffer = ee.Image('projects/ee-guilhermeiablo/assets/BING_OSM_World_Unpaved_2kmBuffer');
//Make sure pixels are all either 1 (road buffer) or 0 (no road buffer)
unpavedBuffer = unpavedBuffer.remap([-999999999,1], [0,1], 0, 'b1');
unpavedBuffer = unpavedBuffer.updateMask(unpavedBuffer.neq(0));
Map.addLayer(unpavedBuffer);


//Access the buffers for paved and unpaved roads
var pavedBuffer = ee.Image('projects/ee-guilhermeiablo/assets/OSM_World_Paved_RasterizedBi_EuclideanDistances_2kmBuffer');
//Make sure pixels are all either 1 (road buffer) or 0 (no road buffer)
pavedBuffer = pavedBuffer.remap([-999999999,1], [0,1], 0, 'b1');
pavedBuffer = pavedBuffer.updateMask(pavedBuffer.neq(0));
Map.addLayer(pavedBuffer);


//Normalize the innaccessibility factors to range from 0.9 - 1

//Find the max and min values of the original source datasets
var rain_min = 0.00040342152231787054;
var rain_max = 10.66559062333425;

var slope_min = 0;
var slope_max = 90;

var new_min = 0.25;
var new_max = 0.95;

//normalized_slope = (((slope - slope_min)/(slope_max - slope_min))*(new_max-new_min))+new_min
var normalized_slope = slopeAt200m.divide(slope_max)
normalized_slope = normalized_slope.multiply((new_max-new_min))
normalized_slope = normalized_slope.add(new_min)
normalized_slope = normalized_slope.multiply(-1)
normalized_slope = normalized_slope.add((new_max+new_min))

//normalized_rain = (((rain - rain_min)/(rain_max - rain_min))*(100-90))+90
var normalized_rain = rain.divide(rain_max)
normalized_rain = normalized_rain.multiply((new_max-new_min))
normalized_rain = normalized_rain.add(new_min)
normalized_rain = normalized_rain.multiply(-1)
normalized_rain = normalized_rain.add((new_max+new_min))

//Put the innaccessibility factors together
var innaccessibility = normalized_rain.multiply(normalized_slope);
//Map.addLayer(innaccessibility,{min:0.75, max:1},'Innaccessibility factor');

//Get the entire rural population
var rural_pop = worldpopAt200.multiply(smod);


//Get the population with the innaccessibility factor
var rural_pop_access = rural_pop.multiply(innaccessibility);

//Map.addLayer(pop_access,{},'Population weighted by access');

//Multiply by paved and unpaved buffer
var pop_buffer_paved = rural_pop.multiply(pavedBuffer);
var pop_buffer_unpaved = rural_pop_access.multiply(unpavedBuffer);

//Map.addLayer(pop_buffer_paved, {min:0, max:40}, 'Population in paved');





//ZONAL STATS BY COUNTRY

//Get countries
var countries = ee.FeatureCollection('projects/ee-guilhermeiablo/assets/sdsn-countries');



//Reduce the resolution in all raster being passed to zonal stats so it's faster
//And the projection has to be set as it's lost in the process of mosaicking
rural_pop = rural_pop.setDefaultProjection(worldpopAt200.projection());
//Reduce resolution by two-fold (original pixel is 92.76624203150153m)
var projectionAt400 = rural_pop.projection().atScale(371.06496812600612);

var ruralpopAt400 = rural_pop.reduceResolution({
  reducer: ee.Reducer.sum().unweighted(),
  maxPixels: 1024
}).reproject({
  crs:projectionAt400
});

//Map.addLayer(ruralpopAt400);

var pop_buffer_pavedAt400 = pop_buffer_paved.reduceResolution({
  reducer: ee.Reducer.sum().unweighted(),
  maxPixels: 1024
}).reproject({
  crs:projectionAt400
});

var pop_buffer_unpavedAt400 = pop_buffer_unpaved.reduceResolution({
  reducer: ee.Reducer.sum().unweighted(),
  maxPixels: 1024
}).reproject({
  crs:projectionAt400
});


//Put two populations together with max rule
var final_pop = ee.ImageCollection.fromImages([pop_buffer_pavedAt400, pop_buffer_unpavedAt400]);
final_pop = final_pop.max();

Map.addLayer(final_pop,{},'Rural Pop w/ Access');




//Zonal stats for total rural population
var rural_pop_access_country = final_pop.reduceRegions({
  collection: countries,
  reducer: ee.Reducer.sum(),
  scale: 371.06496812600612,
  tileScale:16
});

//Zonal stats for rural population with access to paved roads (NASA SEDAC method)
var rural_pop_paved_access_country = pop_buffer_pavedAt400.reduceRegions({
  collection: countries,
  reducer: ee.Reducer.sum(),
  scale: 371.06496812600612,
  tileScale:16
});


//Zonal stats for total rural population
//var rural_pop_country = ruralpopAt400.reduceRegions({
//  collection: countries,
//  reducer: ee.Reducer.sum(),
//  scale: 371.06496812600612,
//  tileScale:16
//});

Export.table.toDrive({
  collection:rural_pop_access_country,
  description:'RuralPopulationWithAccessByCountry_025_raincorrected',
  fileFormat:'CSV'
})
