import { Delivery } from '../types';
import { STORE_LOCATION } from '../constants';

// Calculates geodesic distance between two points (Haversine Formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

/**
 * Optimizes the route using the Nearest Neighbor Algorithm.
 * 1. Starts at the STORE.
 * 2. Finds the closest pending delivery.
 * 3. Moves to that delivery and finds the next closest.
 * 4. Repeats until all deliveries are visited.
 */
export const optimizeRoute = (deliveries: Delivery[]): Delivery[] => {
  if (deliveries.length === 0) return [];

  // Separate delivered items from pending/in-transit to prioritize pending
  // Or, simply optimize everything based on location.
  // Prompt implies "Optimization for driver", usually implies the whole route.
  
  let remaining = [...deliveries];
  const optimized: Delivery[] = [];
  
  // Start point: The Store
  let currentLat = STORE_LOCATION[0];
  let currentLng = STORE_LOCATION[1];

  while (remaining.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = getDistanceFromLatLonInKm(
        currentLat,
        currentLng,
        remaining[i].lat,
        remaining[i].lng
      );

      // Simple heuristic: If status is 'delivered', we treat it as already visited mentally, 
      // but for route planning, we might want to see the history. 
      // However, usually, we optimize the *Pending* route. 
      // For this implementation, we optimize purely on geography to show the line.
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    if (nearestIndex !== -1) {
      const nextStop = remaining[nearestIndex];
      optimized.push(nextStop);
      
      // Update current position to the found stop
      currentLat = nextStop.lat;
      currentLng = nextStop.lng;
      
      // Remove from remaining
      remaining.splice(nearestIndex, 1);
    } else {
      break;
    }
  }

  return optimized;
};