#Import numpy so we can manipulate our rasters as multidimensional arrays
import numpy as np
import rasterio
import glob
import os

# File and folder paths
dirpath = r'/Volumes/GUILHERME/_osm_exports/_euclidean/_binaries/'



# Make a search criteria to select the DEM files
search_criteria = "*_Paved*.tif"
q = os.path.join(dirpath, search_criteria)

files = glob.glob(q)
files
print(files)

src_files_to_mosaic = []
for file in files:
    src = rasterio.open(file)
    src_files_to_mosaic.append(src)
src_files_to_mosaic

from rasterio.merge import merge
mosaic, out_trans = merge(src_files_to_mosaic, method='max')

out_meta = src.meta.copy()
out_meta.update({"driver": "GTiff",
                 "height": mosaic.shape[1],
                 "width": mosaic.shape[2],
                 "transform": out_trans,
                }
               )

out_fp = r'/Volumes/GUILHERME/_osm_exports/_euclidean/_binaries/OSM_World_Paved_RasterizedBinary.tif'

with rasterio.open(out_fp, "w", **out_meta) as dest:
    dest.write(mosaic)
