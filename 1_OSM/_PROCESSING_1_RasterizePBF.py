import glob
import os
import fiona
import distancerasters as dr
import rasterio
# Import the library
import pyrosm


# File and folder paths
dirpath = '/Volumes/GUILHERME/_osm_exports/_new_pbfs/'
length = len(dirpath)


# Make a search criteria to select the DEM files
search_criteria = "*.osm.pbf"
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
    try:
        with rasterio.Env(CHECK_DISK_FREE_SPACE=False):
            # load vector data (crs = epsg:4326)
            print('Reading OSM file with pyrosm: '+file)
            osm = pyrosm.OSM(file)
            print('Reading network with pyrosm')
            net = osm.get_network()

            bounds = tuple(net.total_bounds)
            print('Getting rid of fields other than geometry')
            net = net.geometry
            # resolution (in units matching projection) at which vector data will be rasterized
            pixel_size = 0.008
            # rasterize vector data and output to geotiff
            print('Rasterizing file for '+file[length:-8])
            rv_array, affine = dr.rasterize(net, pixel_size=pixel_size, bounds=bounds, output="/Volumes/GUILHERME/_osm_exports/_euclidean/"+file[length:-8]+"_rasterized_binary.tif")
            # generate distance array and output to geotiff
            
            # dist_array = my_dr.dist_array
    except:
        pass