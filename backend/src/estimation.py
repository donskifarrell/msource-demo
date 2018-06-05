
import os
import re
import subprocess

from src import helpers, gcoder
from settings import SLICER_PATH, UPLOAD_FOLDER, PRICE_PER_HOUR, PRICE_PER_GRAM


def convert_stl_to_gcode(filename):
    print('Function::convert_stl_to_gcode')

    slicer_settings = [SLICER_PATH,
                       "--load", "cfg.ini", os.path.join(UPLOAD_FOLDER, filename)]
    slicer_output = subprocess.check_output(slicer_settings)  # Blocking
    print(slicer_output)

    return slicer_output


def extract_slicer_details(slicer_output):
    print('Function::extract_slicer_details')

    try:
        weight_regex_search = re.search(
            b'(Weight: [0-9]*.[0-9]*)\w+', slicer_output).group(0)
        weight_str = str(weight_regex_search,
                         'utf-8').replace('Weight: ', '').replace('g', '')
        weight = float(weight_str)
    except AttributeError:
        weight = 1.0
    print(weight)

    try:
        filament_regex_search = re.search(
            b'(Filament required: [0-9]*.[0-9]*)\w+', slicer_output).group(0)
        filament_str = str(filament_regex_search,
                           'utf-8').replace('Filament required: ', '').replace('mm', '')
        filament = float(filament_str)
    except AttributeError:
        filament = 1.0
    print(filament)

    return True


def load_gcode(filename):
    print('Function::extract_gcode_details')

    first, file_extension = os.path.splitext(filename)
    gcode_sliced = first + '.gcode'

    fname = os.path.join(UPLOAD_FOLDER, gcode_sliced)

    gcode_output = gcoder.GCode(open(fname, "rU"))
    print(gcode_output)
    return gcode_output


def extract_gcode_details(gcode):
    print('Function::extract_gcode_details')

    print("Dimensions:")
    xdims = (gcode.xmin, gcode.xmax, gcode.width)
    print("\tX: %0.02f - %0.02f (%0.02f)" % xdims)
    ydims = (gcode.ymin, gcode.ymax, gcode.depth)
    print("\tY: %0.02f - %0.02f (%0.02f)" % ydims)
    zdims = (gcode.zmin, gcode.zmax, gcode.height)
    print("\tZ: %0.02f - %0.02f (%0.02f)" % zdims)
    print("Filament used: %0.02fmm" % gcode.filament_length)
    print("Number of layers: %d" % gcode.layers_count)
    print("Estimated duration: %s" % gcode.estimate_duration()[1])
    print("Estimated duration Hours: %s" % gcode.duration_hours)

    dur_in_hours = helpers.round_to_5(gcode.duration_hours)
    if dur_in_hours == 0:
        dur_in_hours = 0.5

    time_cost = dur_in_hours * PRICE_PER_HOUR
    material_cost = gcode.filament_length * PRICE_PER_GRAM  # basic calc
    total_cost = time_cost + material_cost

    print("Time Cost: %s" % time_cost)
    print("Material Cost: %s" % material_cost)
    print("Total Cost: %s" % total_cost)
    print("\n")

    costs = {}
    costs['total'] = total_cost
    costs['time'] = time_cost
    costs['material'] = material_cost

    filament = {}
    filament['length'] = gcode.filament_length
    filament['layers'] = gcode.layers_count

    result = {}
    result['duration'] = dur_in_hours
    result['costs'] = costs
    result['filament'] = filament

    return result
