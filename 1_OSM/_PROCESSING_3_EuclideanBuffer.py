import glob
import os
import fiona
import distancerasters as dr
import rasterio
# Import the library
import pyrosm


# File and folder paths
dirpath = r'/Volumes/GUILHERME/_osm_exports/_euclidean/_binaries/'


# Make a search criteria to select the DEM files
search_criteria = "*World*.tif"
q = os.path.join(dirpath, search_criteria)

files = glob.glob(q)
files
print('Running script for the following files in: '+dirpath)

# function to define which cells from rasterized input to calculate distance to
#   - this is the default function, and does not need to be explicity passed to class
#   - this would be modified if using a non-binary rasterization
def raster_conditional(rarray):
    return (rarray == 1)


#rural = gpd.read_file('/Users/guilhermeiablonovski/Dropbox (SDSN)/SDG Geospatial Indicators Project/sdg-roadinfrastructure/_raw_data/GRUMP_SMOD_Rural.gpkg')


for file in files:
    with rasterio.open(file) as src:
        affine=src.transform
        rv_array=src.read(1)
        # generate distance array and output to geotiff
        print('Calculatin euclidean distances for '+file[43:-8])
        my_dr = dr.DistanceRaster(rv_array, affine=affine,
            output_path="/Volumes/GUILHERME/_osm_exports/_euclidean/"+file[43:-8]+"_EuclideanDistances.tif",
            conditional=raster_conditional)
        # dist_array = my_dr.dist_array