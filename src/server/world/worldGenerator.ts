/** Modules */
import * as worldSystem from '../worldSystem';

/** Data */
import { World } from '../../common/models';

export function generateLand (world: World) {
    let auto = worldSystem.getAutomaton('automaton', world.width, world.height);
    world.land = auto.cells;
}
export function generateElevation (world: World) {
    if (!world.land) {
        console.log('The world has not generated any land yet to define elevation!');
    }
    let elevation = [];
    let wavelength = 6;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('elevation');
    for (let i = 0, max = world.width * world.height; i < max; i++) {
        let x = Math.floor(i % world.width);
        let y = Math.floor(i / world.width);
        elevation[i] = Math.floor(noise.noise2d(x / wavelength, y / wavelength) * amplitude);
    }
    world.elevation = elevation;
}
export function generateTemperature (world: World) {
    if (!world.elevation) {
        console.log('The world has no elevation map to generate temperature on!');
    }
    let temp = [];
    let wavelength = 12;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('temperature');
    for (let i = 0, max = world.width * world.height; i < max; i++) {
        let x = Math.floor(i % world.width);
        let y = Math.floor(i / world.width);
        temp[i] = Math.floor(noise.noise2d(x / wavelength, y / wavelength) * amplitude);
    }
    world.temperature = temp;
}
export function generateHydrology (world: World) {
    if (!world.temperature || !world.elevation) {
        console.log('The world has no temperature or no elevation!');
    }
    let hydro = [];
    let wavelength = 8;
    let amplitude = worldSystem.MAX_ELEVATION;
    let noise = worldSystem.getNoise('hydrology');
    for (let i = 0, max = world.width * world.height; i < max; i++) {
        let x = Math.floor(i % world.width);
        let y = Math.floor(i / world.width);
        hydro[i] = Math.floor(noise.noise2d(x / wavelength, y / wavelength) * amplitude);
    }
    world.hydrology = hydro;
}
/**
 * Creates the elements which can be found within each
 * region generated dependent on the land, elevation,
 * temperature, and hydrology fields.
 */
export function generateElements (world: World) {
    // if (!world.temperature || !world.elevation) {
    //     console.log('Cannot create elements with no temperature or elevation!');
    // }
    // let elements: ELEMENTS[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let element: ELEMENTS;
    //     let height = world.elevation[i];
    //     let heat = world.temperature[i];
    //     if (height > 120) {
    //         element = ELEMENTS.OXYGEN;
    //     } else if (height > 60) {
    //         element = ELEMENTS.HYDROGEN;
    //     } else if (height > 30) {
    //         element = ELEMENTS.CARBON;
    //     } else if (height > 10) {
    //         element = ELEMENTS.GOLD;
    //     } else {
    //         element = ELEMENTS.IRON;
    //     }
    // }
    // return elements;
}
/**
 * Creates the biomes which depend upon the generated
 * land, elevation, temperature, and hydrology fields.
 */
export function generateRegions (world: World) {
    // if (!world.elevation || !world.hydrology) {
    //     console.log('Cannot create regions when there is no elevation or hydrology!');
    // }
    // let regions: WorldRegion[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let regionType: REGIONS;
    //     if (world.elevation[i] > 120) {
    //         regionType = REGIONS.HILLS;
    //     } else if (world.elevation[i] > 80 && world.hydrology[i] < 5) {
    //         regionType = REGIONS.FOREST;
    //     } else if (world.elevation[i] > 40 && world.hydrology[i] < 5) {
    //         regionType = REGIONS.PLAINS;
    //     } else {
    //         regionType = REGIONS.SEA;
    //     }
    //     let newRegion = new WorldRegion(
    //         world.getHash('region-' + i),
    //         regionType,
    //         i % world.width,
    //         Math.floor(i / world.width),
    //         world.elevation[i]
    //     );
    //     regions[i] = newRegion;
    // }
    // return regions;
}
/**
 * Creates the synthesized location of each cell
 * in the created world.
 */
export function generateLocations(world: World) {
    // if (!world.regions || !world.elements) {
    //     console.log('Cannot create locations with no regions or elements!');
    // }
    // let locations: WorldLocation[] = [];
    // for (let i = 0; i < world.width * world.height; i++) {
    //     let locationType: LOCATIONS;
    //     let element = world.elements[i];
    //     if (element === ELEMENTS.CARBON) {
    //         locationType = LOCATIONS.DIRT;
    //     } else {
    //         locationType = LOCATIONS.GRASS;
    //     }
    //     locations[i] = new WorldLocation(
    //         world.getHash('location-' + i),
    //         i % world.width,
    //         Math.floor(i / world.width),
    //         world.elevation[i],
    //         locationType
    //     );
    // }
    // return locations;
}