import glob
import os
import fiona
import distancerasters as dr
import rasterio


# File and folder paths
dirpath = r'/Volumes/GUILHERME/_osm_exports/_new_pbfs/ogr/'
length = len(dirpath)

# Make a search criteria to select the DEM files
search_criteria = "*name.gpkg"
q = os.path.join(dirpath, search_criteria)

files = glob.glob(q)
files

# function to define which cells from rasterized input to calculate distance to
#   - this is the default function, and does not need to be explicity passed to class
#   - this would be modified if using a non-binary rasterization
def raster_conditional(rarray):
    return (rarray == 1)


#rural = gpd.read_file('/Users/guilhermeiablonovski/Dropbox (SDSN)/SDG Geospatial Indicators Project/sdg-roadinfrastructure/_raw_data/GRUMP_SMOD_Rural.gpkg')


for file in files:
    with rasterio.Env(CHECK_DISK_FREE_SPACE=False):
        # load vector data (crs = epsg:4326)
        shp = fiona.open(file, "r")
        # resolution (in units matching projection) at which vector data will be rasterized
        pixel_size = 0.008
        # rasterize vector data and output to geotiff
        rv_array, affine = dr.rasterize(shp, pixel_size=pixel_size, bounds=shp.bounds, output="/Volumes/GUILHERME/_osm_exports/_euclidean/"+file[length:-5]+"_rasterized_binary.tif")
        # generate distance array and output to geotiff