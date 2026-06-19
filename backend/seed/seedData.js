const Satellite = require('../models/Satellite');
const Mission = require('../models/Mission');
const Debris = require('../models/Debris');
const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');
const Log = require('../models/Log');
const { generateSatelliteId, generateMissionId, generateDebrisId, generateAlertId } = require('../utils/helpers');

const satelliteData = [
  { name: 'Sentinel-1A', orbitType: 'SSO', altitude: 693, velocity: 7.5, status: 'Operational', operator: 'ESA', country: 'Europe', health: 95 },
  { name: 'Hubble Space Telescope', orbitType: 'LEO', altitude: 547, velocity: 7.6, status: 'Operational', operator: 'NASA', country: 'USA', health: 78 },
  { name: 'ISS Zarya Module', orbitType: 'LEO', altitude: 408, velocity: 7.66, status: 'Operational', operator: 'NASA/Roscosmos', country: 'International', health: 88 },
  { name: 'GPS IIF-12', orbitType: 'MEO', altitude: 20200, velocity: 3.87, status: 'Operational', operator: 'US Space Force', country: 'USA', health: 92 },
  { name: 'GOES-16', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'NOAA', country: 'USA', health: 96 },
  { name: 'Chandrayaan-3 Orbiter', orbitType: 'HEO', altitude: 100, velocity: 1.68, status: 'Operational', operator: 'ISRO', country: 'India', health: 85 },
  { name: 'Starlink-4521', orbitType: 'LEO', altitude: 550, velocity: 7.6, status: 'Operational', operator: 'SpaceX', country: 'USA', health: 99 },
  { name: 'COSMO-SkyMed', orbitType: 'SSO', altitude: 620, velocity: 7.56, status: 'Operational', operator: 'ASI', country: 'Italy', health: 90 },
  { name: 'ALOS-2', orbitType: 'SSO', altitude: 628, velocity: 7.55, status: 'Operational', operator: 'JAXA', country: 'Japan', health: 87 },
  { name: 'TianGong Station', orbitType: 'LEO', altitude: 390, velocity: 7.68, status: 'Operational', operator: 'CNSA', country: 'China', health: 94 },
  { name: 'Galileo-FOC-23', orbitType: 'MEO', altitude: 23222, velocity: 3.6, status: 'Operational', operator: 'ESA', country: 'Europe', health: 91 },
  { name: 'RADARSAT-2', orbitType: 'SSO', altitude: 798, velocity: 7.45, status: 'Degraded', operator: 'CSA', country: 'Canada', health: 62 },
  { name: 'Meteosat-12', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'EUMETSAT', country: 'Europe', health: 97 },
  { name: 'KOMPSAT-5', orbitType: 'SSO', altitude: 550, velocity: 7.59, status: 'Operational', operator: 'KARI', country: 'South Korea', health: 83 },
  { name: 'CARTOSAT-3', orbitType: 'SSO', altitude: 509, velocity: 7.61, status: 'Operational', operator: 'ISRO', country: 'India', health: 89 },
  { name: 'WorldView-4', orbitType: 'SSO', altitude: 617, velocity: 7.56, status: 'Decommissioned', operator: 'Maxar', country: 'USA', health: 0 },
  { name: 'Starlink-5102', orbitType: 'LEO', altitude: 550, velocity: 7.6, status: 'Launching', operator: 'SpaceX', country: 'USA', health: 100 },
  { name: 'GLONASS-K2', orbitType: 'MEO', altitude: 19100, velocity: 3.95, status: 'Operational', operator: 'Roscosmos', country: 'Russia', health: 86 },
  { name: 'BeiDou-3 M23', orbitType: 'MEO', altitude: 21528, velocity: 3.82, status: 'Operational', operator: 'CNSA', country: 'China', health: 93 },
  { name: 'TerraSAR-X', orbitType: 'SSO', altitude: 514, velocity: 7.61, status: 'Operational', operator: 'DLR', country: 'Germany', health: 80 },
  { name: 'Landsat-9', orbitType: 'SSO', altitude: 705, velocity: 7.49, status: 'Operational', operator: 'NASA/USGS', country: 'USA', health: 98 },
  { name: 'SPOT-7', orbitType: 'SSO', altitude: 694, velocity: 7.5, status: 'Operational', operator: 'Airbus', country: 'France', health: 82 },
  { name: 'Ingenio', orbitType: 'SSO', altitude: 670, velocity: 7.52, status: 'Decommissioned', operator: 'INTA', country: 'Spain', health: 0 },
  { name: 'IRNSS-1G', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'ISRO', country: 'India', health: 88 },
  { name: 'OneWeb-0347', orbitType: 'LEO', altitude: 1200, velocity: 7.3, status: 'Operational', operator: 'OneWeb', country: 'UK', health: 95 },
  { name: 'Intelsat-40e', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'Intelsat', country: 'USA', health: 91 },
  { name: 'GSAT-30', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'ISRO', country: 'India', health: 90 },
  { name: 'Jason-3', orbitType: 'LEO', altitude: 1336, velocity: 7.2, status: 'Degraded', operator: 'NOAA/CNES', country: 'USA/France', health: 55 },
  { name: 'Iridium NEXT-58', orbitType: 'LEO', altitude: 780, velocity: 7.46, status: 'Operational', operator: 'Iridium', country: 'USA', health: 94 },
  { name: 'Paz SAR', orbitType: 'SSO', altitude: 514, velocity: 7.61, status: 'Operational', operator: 'Hisdesat', country: 'Spain', health: 87 },
  { name: 'EROS-C', orbitType: 'SSO', altitude: 400, velocity: 7.67, status: 'Operational', operator: 'IAI', country: 'Israel', health: 92 },
  { name: 'SAOCOM-1B', orbitType: 'SSO', altitude: 620, velocity: 7.56, status: 'Operational', operator: 'CONAE', country: 'Argentina', health: 85 },
  { name: 'Pleiades Neo 4', orbitType: 'SSO', altitude: 620, velocity: 7.56, status: 'Operational', operator: 'Airbus', country: 'France', health: 97 },
  { name: 'Kanopus-V-IK', orbitType: 'SSO', altitude: 510, velocity: 7.61, status: 'Degraded', operator: 'Roscosmos', country: 'Russia', health: 48 },
  { name: 'TURKSAT 5B', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'Turksat', country: 'Turkey', health: 93 },
  { name: 'SES-17', orbitType: 'GEO', altitude: 35786, velocity: 3.07, status: 'Operational', operator: 'SES', country: 'Luxembourg', health: 96 },
  { name: 'Kuaizhou-11', orbitType: 'LEO', altitude: 500, velocity: 7.62, status: 'Launching', operator: 'ExPace', country: 'China', health: 100 },
  { name: 'Yaogan-35B', orbitType: 'SSO', altitude: 500, velocity: 7.62, status: 'Operational', operator: 'PLA', country: 'China', health: 90 },
  { name: 'ICEYE-X14', orbitType: 'SSO', altitude: 570, velocity: 7.58, status: 'Operational', operator: 'ICEYE', country: 'Finland', health: 96 },
  { name: 'Capella-9', orbitType: 'SSO', altitude: 525, velocity: 7.6, status: 'Operational', operator: 'Capella Space', country: 'USA', health: 94 }
];

const missionTypes = ['Observation', 'Communication', 'Navigation', 'Research', 'Defense', 'Commercial'];
const missionStatuses = ['Scheduled', 'Active', 'Completed', 'Delayed'];
const durations = ['3 months', '6 months', '1 year', '2 years', '5 years', '10 years', '15 years'];

const missionNames = [
  { name: 'Arctic Sentinel', code: 'ARC-SNT', type: 'Observation', orbit: 'SSO', desc: 'Polar ice monitoring and climate change observation' },
  { name: 'Deep Space Relay', code: 'DSR-01', type: 'Communication', orbit: 'GEO', desc: 'Deep space communication relay network' },
  { name: 'NavGrid Alpha', code: 'NGA-02', type: 'Navigation', orbit: 'MEO', desc: 'Next-generation global navigation augmentation' },
  { name: 'Solar Wind Study', code: 'SWS-07', type: 'Research', orbit: 'HEO', desc: 'Solar wind particle analysis and space weather' },
  { name: 'Orbital Guardian', code: 'ORB-GRD', type: 'Defense', orbit: 'LEO', desc: 'Space domain awareness and tracking' },
  { name: 'StarNet Expansion', code: 'SNE-15', type: 'Commercial', orbit: 'LEO', desc: 'Broadband constellation expansion phase 3' },
  { name: 'Ocean Monitor', code: 'OCM-03', type: 'Observation', orbit: 'SSO', desc: 'Global ocean current and temperature monitoring' },
  { name: 'Quantum Link', code: 'QLK-01', type: 'Communication', orbit: 'LEO', desc: 'Quantum key distribution satellite communication' },
  { name: 'Europa Pathfinder', code: 'EUP-01', type: 'Research', orbit: 'HEO', desc: 'Technology demonstration for Europa mission' },
  { name: 'Sentinel Shield', code: 'SS-04', type: 'Defense', orbit: 'GEO', desc: 'Early warning and missile tracking system' },
  { name: 'CloudSat-Next', code: 'CSN-02', type: 'Observation', orbit: 'SSO', desc: 'Cloud profiling and precipitation measurement' },
  { name: 'TeleHealth Orbit', code: 'THO-01', type: 'Commercial', orbit: 'GEO', desc: 'Remote healthcare connectivity platform' },
  { name: 'MagnetoSphere', code: 'MGS-05', type: 'Research', orbit: 'HEO', desc: 'Magnetosphere dynamics research mission' },
  { name: 'Urban Watch', code: 'UW-08', type: 'Observation', orbit: 'SSO', desc: 'Urban growth and infrastructure monitoring' },
  { name: 'Galileo Service', code: 'GAL-SV', type: 'Navigation', orbit: 'MEO', desc: 'Galileo constellation service maintenance' }
];

const debrisObjects = [
  'Cosmos 2251 Fragment', 'Iridium 33 Fragment', 'Fengyun-1C Fragment', 'Delta II Rocket Body',
  'SL-16 Rocket Body', 'Ariane 5 Upper Stage', 'CZ-4C Debris', 'Atlas V Centaur',
  'H-2A Upper Stage', 'Proton-M Briz', 'PSLV Stage 4', 'Falcon 9 Debris',
  'Vega Debris', 'Soyuz Fregat', 'Long March 3B', 'SL-12 Rocket',
  'Titan IIIC Transtage', 'Delta IV Debris', 'Kosmos Fragment A', 'Kosmos Fragment B',
  'Fengyun Fragment C', 'CZ-2C Debris', 'Ariane 4 Stage', 'Scout Debris',
  'Pegasus Debris', 'Minotaur Debris', 'GSLV Debris', 'Zenit Fragment',
  'Antares Debris', 'Electron Kick Stage', 'Unknown Object Alpha', 'Unknown Object Beta',
  'Microsat Fragment 1', 'Microsat Fragment 2', 'Thermal Blanket 01', 'Solar Panel Fragment',
  'Antenna Fragment', 'Bolt Cluster A', 'Paint Flake Cloud', 'Coolant Droplets'
];

const countries = ['USA', 'Russia', 'China', 'India', 'Europe', 'Japan', 'France', 'Germany', 'UK', 'Unknown'];
const sizes = ['Small (<10cm)', 'Medium (10cm-1m)', 'Large (>1m)'];
const riskCategories = ['Low', 'Medium', 'High', 'Critical'];
const trackingStatuses = ['Tracked', 'Tracked', 'Tracked', 'Untracked', 'Lost']; // weighted toward Tracked

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await Promise.all([
      Satellite.deleteMany({}),
      Mission.deleteMany({}),
      Debris.deleteMany({}),
      Telemetry.deleteMany({}),
      Alert.deleteMany({}),
      Log.deleteMany({})
    ]);

    console.log('  ✓ Cleared existing data');

    // Seed Satellites (40)
    const satelliteDocs = [];
    for (const sat of satelliteData) {
      satelliteDocs.push({
        ...sat,
        satelliteId: generateSatelliteId(),
        launchDate: randomDate(new Date('2010-01-01'), new Date('2025-12-31')),
        description: `${sat.name} is a ${sat.orbitType} orbit satellite operated by ${sat.operator} for ${sat.country}.`
      });
    }
    const satellites = await Satellite.insertMany(satelliteDocs);
    console.log(`  ✓ Seeded ${satellites.length} satellites`);

    // Seed Missions (15)
    const missionDocs = [];
    for (let i = 0; i < missionNames.length; i++) {
      const m = missionNames[i];
      const satIndex = i % satellites.length;
      missionDocs.push({
        missionId: generateMissionId(),
        name: m.name,
        missionCode: m.code,
        satellite: satellites[satIndex]._id,
        missionType: m.type,
        destinationOrbit: m.orbit,
        launchDate: randomDate(new Date('2023-01-01'), new Date('2026-12-31')),
        duration: durations[Math.floor(Math.random() * durations.length)],
        status: missionStatuses[Math.floor(Math.random() * missionStatuses.length)],
        description: m.desc
      });
    }
    const missions = await Mission.insertMany(missionDocs);
    console.log(`  ✓ Seeded ${missions.length} missions`);

    // Seed Debris (120)
    const debrisDocs = [];
    for (let i = 0; i < 120; i++) {
      const baseName = debrisObjects[i % debrisObjects.length];
      const suffix = i >= debrisObjects.length ? ` #${Math.floor(i / debrisObjects.length) + 1}` : '';
      debrisDocs.push({
        debrisId: generateDebrisId(),
        objectName: baseName + suffix,
        altitude: Math.round((Math.random() * 1500 + 200) * 10) / 10,
        velocity: Math.round((Math.random() * 5 + 3) * 100) / 100,
        objectSize: sizes[Math.floor(Math.random() * sizes.length)],
        riskCategory: riskCategories[Math.floor(Math.random() * riskCategories.length)],
        trackingStatus: trackingStatuses[Math.floor(Math.random() * trackingStatuses.length)],
        countryOfOrigin: countries[Math.floor(Math.random() * countries.length)],
        description: `Orbital debris object tracked in ${Math.random() > 0.5 ? 'LEO' : 'MEO'} region`
      });
    }
    const debris = await Debris.insertMany(debrisDocs);
    console.log(`  ✓ Seeded ${debris.length} debris objects`);

    // Seed Telemetry for every satellite
    const telemetryDocs = [];
    const commStatuses = ['Online', 'Intermittent', 'Offline'];
    for (const sat of satellites) {
      if (sat.status === 'Decommissioned') {
        telemetryDocs.push({
          satellite: sat._id,
          battery: 0,
          temperature: -50,
          signalStrength: 0,
          cpuUsage: 0,
          communicationStatus: 'Offline',
          lastUpdated: new Date()
        });
      } else {
        telemetryDocs.push({
          satellite: sat._id,
          battery: Math.round(Math.random() * 50 + 50),
          temperature: Math.round((Math.random() * 60 - 10) * 10) / 10,
          signalStrength: Math.round(Math.random() * 40 + 60),
          cpuUsage: Math.round(Math.random() * 60 + 10),
          communicationStatus: commStatuses[Math.floor(Math.random() * commStatuses.length)],
          lastUpdated: new Date()
        });
      }
    }
    const telemetry = await Telemetry.insertMany(telemetryDocs);
    console.log(`  ✓ Seeded ${telemetry.length} telemetry records`);

    // Generate collision alerts for satellites close to debris
    let alertCount = 0;
    for (const sat of satellites) {
      if (sat.status === 'Decommissioned') continue;
      for (const deb of debris) {
        const altDiff = Math.abs(sat.altitude - deb.altitude);
        if (altDiff < 5) {
          await Alert.create({
            alertId: generateAlertId(),
            satellite: sat._id,
            debris: deb._id,
            riskLevel: 'HIGH',
            status: Math.random() > 0.3 ? 'Active' : 'Resolved',
            operatorNotes: Math.random() > 0.5 ? 'Monitoring situation closely' : '',
            timestamp: randomDate(new Date('2025-01-01'), new Date())
          });
          alertCount++;
          if (alertCount > 25) break; // Cap alerts
        }
      }
      if (alertCount > 25) break;
    }
    console.log(`  ✓ Seeded ${alertCount} collision alerts`);

    // Seed initial log
    await Log.create({
      action: 'System Initialized',
      entity: 'System',
      entityId: '',
      details: `Database seeded with ${satellites.length} satellites, ${missions.length} missions, ${debris.length} debris objects, ${telemetry.length} telemetry records, and ${alertCount} alerts`
    });

    console.log('✅ Database seed complete!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    throw error;
  }
};

module.exports = seedDatabase;
