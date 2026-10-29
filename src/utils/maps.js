import { CITIES } from "@/data/mockData";

/**
 * Builds a universal Google Maps Directions URL for driving between source and destination.
 * Supports optional waypoints based on the selected route/corridor.
 *
 * @param {Object} options
 * @param {string|Object} options.source - Source city key (e.g. "guwahati") or city object
 * @param {string|Object} options.dest - Destination city key (e.g. "itanagar") or city object
 * @param {Object} [options.route] - Selected route object with optional waypoints/corridor info
 * @returns {string} Google Maps directions URL
 */
export function getGoogleMapsRouteUrl({ source, dest, route }) {
  const sCity =
    typeof source === "string" ? CITIES[source.toLowerCase()] : source;
  const dCity =
    typeof dest === "string" ? CITIES[dest.toLowerCase()] : dest;

  const origin = sCity?.name
    ? `${sCity.name}${sCity.state ? `, ${sCity.state}` : ""}, India`
    : typeof source === "string" && source.trim()
    ? source.trim()
    : "Guwahati, Assam, India";

  const destination = dCity?.name
    ? `${dCity.name}${dCity.state ? `, ${dCity.state}` : ""}, India`
    : typeof dest === "string" && dest.trim()
    ? dest.trim()
    : "Itanagar, Arunachal Pradesh, India";

  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "driving",
  });

  // Extract explicit or intelligent corridor waypoints
  const waypointsList = [];

  if (Array.isArray(route?.waypoints) && route.waypoints.length > 0) {
    route.waypoints.forEach((wp) => {
      if (typeof wp === "string") {
        const wpCity = CITIES[wp.toLowerCase()];
        waypointsList.push(
          wpCity?.name
            ? `${wpCity.name}${wpCity.state ? `, ${wpCity.state}` : ""}, India`
            : wp
        );
      } else if (wp && typeof wp === "object") {
        if (wp.name) {
          waypointsList.push(
            `${wp.name}${wp.state ? `, ${wp.state}` : ""}, India`
          );
        } else if (wp.lat && wp.lon) {
          waypointsList.push(`${wp.lat},${wp.lon}`);
        }
      }
    });
  } else if (route) {
    const routeLabel = `${route.name || ""} ${route.label || ""} ${route.corridor || ""}`.toLowerCase();
    const sourceKey = (typeof source === "string" ? source : sCity?.id || "").toLowerCase();
    const destKey = (typeof dest === "string" ? dest : dCity?.id || "").toLowerCase();

    // Guwahati <-> Itanagar Corridors
    if (
      (sourceKey === "guwahati" && destKey === "itanagar") ||
      (sourceKey === "itanagar" && destKey === "guwahati")
    ) {
      if (
        routeLabel.includes("north") ||
        route.routeId === "ROUTE-B" ||
        route.id === "B"
      ) {
        // Northern corridor via NH-15 crosses north bank through Tezpur
        waypointsList.push("Tezpur, Assam, India");
      } else if (
        routeLabel.includes("south") ||
        route.routeId === "ROUTE-C" ||
        route.id === "C"
      ) {
        // Southern bypass via NH-715 south bank through Nagaon
        waypointsList.push("Nagaon, Assam, India");
      }
    }
  }

  if (waypointsList.length > 0) {
    params.set("waypoints", waypointsList.join("|"));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Safely opens a Google Maps route in a new browser tab.
 *
 * @param {Object} options
 * @param {string|Object} options.source - Source city key or object
 * @param {string|Object} options.dest - Destination city key or object
 * @param {Object} [options.route] - Route details
 * @param {string} [options.url] - Optional pre-computed Google Maps URL
 * @returns {Window|null} The opened window object or null
 */
export function openGoogleMapsRoute({ source, dest, route, url }) {
  const targetUrl = url || getGoogleMapsRouteUrl({ source, dest, route });

  if (typeof window !== "undefined") {
    return window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  return null;
}
