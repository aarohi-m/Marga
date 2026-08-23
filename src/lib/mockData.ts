/* ============================================================
   MARGA — Centralized mock data layer
   Realistic Indian Railways–style operational data.
   Designed to be swapped for live APIs later.
   ============================================================ */

export type Status = "operational" | "degraded" | "maintenance" | "offline";
export type Severity = "critical" | "high" | "medium" | "low";
export type RecStatus = "pending" | "accepted" | "rejected" | "active";

/* ----------------------------- Stations ----------------------------- */
export interface Station {
  code: string;
  name: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  platforms: number;
  division: string;
  zone: string;
}
export const stations: Station[] = [
  { code: "NDLS", name: "New Delhi", x: 45, y: 25, lat: 28.6425, lng: 77.2195, platforms: 16, division: "Delhi", zone: "Northern" },
  { code: "JP", name: "Jaipur Junction", x: 40, y: 28, lat: 26.9194, lng: 75.7875, platforms: 6, division: "Jaipur", zone: "North Western" },
  { code: "MTJ", name: "Mathura Junction", x: 46, y: 30, lat: 27.4800, lng: 77.6716, platforms: 7, division: "Delhi", zone: "North Central" },
  { code: "AGC", name: "Agra Cantt", x: 48, y: 33, lat: 27.1550, lng: 78.0068, platforms: 6, division: "Agra", zone: "North Central" },
  { code: "SWM", name: "Sawai Madhopur", x: 42, y: 36, lat: 26.0223, lng: 76.3605, platforms: 4, division: "Kota", zone: "West Central" },
  { code: "KOTA", name: "Kota Junction", x: 40, y: 40, lat: 25.1802, lng: 75.8593, platforms: 9, division: "Kota", zone: "West Central" },
  { code: "RTM", name: "Ratlam Junction", x: 36, y: 48, lat: 23.3340, lng: 75.0370, platforms: 6, division: "Ratlam", zone: "Western" },
  { code: "BRC", name: "Vadodara Junction", x: 30, y: 53, lat: 22.3100, lng: 73.1812, platforms: 8, division: "Vadodara", zone: "Western" },
  { code: "ST", name: "Surat", x: 29, y: 58, lat: 21.2060, lng: 72.8395, platforms: 5, division: "Mumbai", zone: "Western" },
  { code: "BCT", name: "Mumbai Central", x: 28, y: 65, lat: 18.9690, lng: 72.8200, platforms: 7, division: "Mumbai", zone: "Western" },
  { code: "BPL", name: "Bhopal Junction", x: 46, y: 48, lat: 23.2688, lng: 77.4119, platforms: 6, division: "Bhopal", zone: "West Central" },
  { code: "NGP", name: "Nagpur Junction", x: 51, y: 55, lat: 21.1493, lng: 79.0866, platforms: 8, division: "Nagpur", zone: "Central" },
  { code: "SC", name: "Secunderabad", x: 49, y: 68, lat: 17.4337, lng: 78.5016, platforms: 10, division: "Secunderabad", zone: "South Central" },
  { code: "MAS", name: "Chennai Central", x: 54, y: 80, lat: 13.0827, lng: 80.2757, platforms: 15, division: "Chennai", zone: "Southern" },
  { code: "SBC", name: "KSR Bengaluru", x: 44, y: 80, lat: 12.9777, lng: 77.5726, platforms: 10, division: "Bengaluru", zone: "South Western" },
  { code: "CNB", name: "Kanpur Central", x: 55, y: 34, lat: 26.4535, lng: 80.3488, platforms: 9, division: "Prayagraj", zone: "North Central" },
  { code: "DDU", name: "Pt. DD Upadhyaya", x: 63, y: 40, lat: 25.2700, lng: 83.0070, platforms: 8, division: "DDU", zone: "East Central" },
  { code: "HWH", name: "Howrah Junction", x: 72, y: 52, lat: 22.5835, lng: 88.3427, platforms: 23, division: "Howrah", zone: "Eastern" },
  { code: "PNBE", name: "Patna Junction", x: 67, y: 38, lat: 25.6100, lng: 85.1393, platforms: 10, division: "Danapur", zone: "East Central" },
  { code: "LKO", name: "Lucknow Charbagh", x: 55, y: 30, lat: 26.8350, lng: 80.9198, platforms: 9, division: "Lucknow", zone: "Northern" },
  { code: "ADI", name: "Ahmedabad Junction", x: 28, y: 50, lat: 23.0264, lng: 72.6003, platforms: 12, division: "Ahmedabad", zone: "Western" },
  { code: "PUNE", name: "Pune Junction", x: 32, y: 68, lat: 18.5285, lng: 73.8740, platforms: 6, division: "Pune", zone: "Central" },
  { code: "GWL", name: "Gwalior Junction", x: 48, y: 36, lat: 26.2134, lng: 78.1843, platforms: 5, division: "Jhansi", zone: "North Central" },
  { code: "JBP", name: "Jabalpur Junction", x: 52, y: 50, lat: 23.1686, lng: 79.9484, platforms: 7, division: "Jabalpur", zone: "West Central" },
  { code: "BBS", name: "Bhubaneswar", x: 66, y: 56, lat: 20.2707, lng: 85.8395, platforms: 6, division: "Khurda", zone: "East Coast" },
  { code: "VSKP", name: "Visakhapatnam", x: 60, y: 62, lat: 17.7275, lng: 83.3193, platforms: 8, division: "Waltair", zone: "East Coast" },
];

/* ----------------------------- Sections ----------------------------- */
export interface Section {
  id: string;
  from: string;
  to: string;
  name: string;
  status: Status;
  speedLimit: number;
  distance: number;
}
export const sections: Section[] = [
  { id: "RS001", from: "BCT", to: "ST", name: "Mumbai–Surat", status: "operational", speedLimit: 130, distance: 263 },
  { id: "RS002", from: "ST", to: "BRC", name: "Surat–Vadodara", status: "operational", speedLimit: 130, distance: 148 },
  { id: "RS003", from: "BRC", to: "RTM", name: "Vadodara–Ratlam", status: "operational", speedLimit: 110, distance: 222 },
  { id: "RS004", from: "RTM", to: "KOTA", name: "Ratlam–Kota", status: "operational", speedLimit: 110, distance: 138 },
  { id: "RS005", from: "KOTA", to: "SWM", name: "Kota–Sawai Madhopur", status: "maintenance", speedLimit: 80, distance: 108 },
  { id: "RS005B", from: "SWM", to: "MTJ", name: "Sawai Madhopur–Mathura", status: "maintenance", speedLimit: 130, distance: 216 },
  { id: "RS006", from: "MTJ", to: "NDLS", name: "Mathura–New Delhi", status: "operational", speedLimit: 130, distance: 142 },
  { id: "RS007", from: "MTJ", to: "AGC", name: "Mathura–Agra", status: "degraded", speedLimit: 90, distance: 54 },
  { id: "RS008", from: "AGC", to: "BPL", name: "Agra–Bhopal", status: "operational", speedLimit: 130, distance: 508 },
  { id: "RS009", from: "BPL", to: "NGP", name: "Bhopal–Nagpur", status: "operational", speedLimit: 120, distance: 390 },
  { id: "RS010", from: "NGP", to: "SC", name: "Nagpur–Secunderabad", status: "operational", speedLimit: 120, distance: 575 },
  { id: "RS011", from: "SC", to: "MAS", name: "Secunderabad–Chennai", status: "operational", speedLimit: 110, distance: 700 },
  { id: "RS012", from: "MAS", to: "SBC", name: "Chennai–Bengaluru", status: "maintenance", speedLimit: 110, distance: 350 },
  { id: "RS013", from: "NDLS", to: "CNB", name: "New Delhi–Kanpur", status: "operational", speedLimit: 130, distance: 440 },
  { id: "RS014", from: "CNB", to: "DDU", name: "Kanpur–DDU", status: "operational", speedLimit: 130, distance: 348 },
  { id: "RS015", from: "DDU", to: "HWH", name: "DDU–Howrah", status: "degraded", speedLimit: 130, distance: 664 },
  { id: "RS016", from: "NDLS", to: "JP", name: "New Delhi–Jaipur", status: "operational", speedLimit: 130, distance: 308 },
  { id: "RS017", from: "JP", to: "SWM", name: "Jaipur–Sawai Madhopur", status: "operational", speedLimit: 120, distance: 132 },
  { id: "RS018", from: "HWH", to: "BBS", name: "Howrah–Bhubaneswar", status: "operational", speedLimit: 130, distance: 440 },
  { id: "RS019", from: "BBS", to: "VSKP", name: "Bhubaneswar–Visakhapatnam", status: "operational", speedLimit: 110, distance: 443 },
  { id: "RS020", from: "VSKP", to: "SC", name: "Visakhapatnam–Secunderabad", status: "operational", speedLimit: 100, distance: 700 },
  { id: "RS021", from: "ADI", to: "BRC", name: "Ahmedabad–Vadodara", status: "operational", speedLimit: 130, distance: 100 },
  { id: "RS022", from: "BCT", to: "PUNE", name: "Mumbai–Pune", status: "operational", speedLimit: 110, distance: 192 },
  { id: "RS023", from: "SC", to: "SBC", name: "Secunderabad–Bengaluru", status: "operational", speedLimit: 110, distance: 570 },
  { id: "RS024", from: "NDLS", to: "LKO", name: "New Delhi–Lucknow", status: "operational", speedLimit: 160, distance: 510 },
  { id: "RS025", from: "LKO", to: "CNB", name: "Lucknow–Kanpur", status: "operational", speedLimit: 130, distance: 82 },
  { id: "RS026", from: "DDU", to: "PNBE", name: "DDU–Patna", status: "operational", speedLimit: 130, distance: 228 },
  { id: "RS027", from: "AGC", to: "GWL", name: "Agra–Gwalior", status: "operational", speedLimit: 120, distance: 117 },
  { id: "RS028", from: "BPL", to: "JBP", name: "Bhopal–Jabalpur", status: "operational", speedLimit: 110, distance: 330 },
  { id: "RS029", from: "JBP", to: "NGP", name: "Jabalpur–Nagpur", status: "operational", speedLimit: 110, distance: 310 },
];

/* ----------------------------- Trains ----------------------------- */
export interface Train {
  no: string;
  name: string;
  status: "Running" | "Halted" | "Departed" | "Arrived" | "Delayed";
  station: string;
  next: string;
  speed: number;
  delay: number;
  eta: string;
  type: "Rajdhani" | "Shatabdi" | "Express" | "Freight";
  priority: 1 | 2 | 3;
  progress: number; // 0-1 between current section
}
export const trains: Train[] = [
  { no: "12951", name: "Mumbai Rajdhani", status: "Running", station: "KOTA", next: "MTJ", speed: 82, delay: 22, eta: "02:10", type: "Rajdhani", priority: 1, progress: 0.32 },
  { no: "12009", name: "Shatabdi Express", status: "Running", station: "SWM", next: "MTJ", speed: 96, delay: 8, eta: "01:48", type: "Shatabdi", priority: 1, progress: 0.6 },
  { no: "12953", name: "August Kranti Rajdhani", status: "Delayed", station: "BRC", next: "RTM", speed: 0, delay: 41, eta: "03:32", type: "Rajdhani", priority: 1, progress: 0.1 },
  { no: "12952", name: "New Delhi Rajdhani", status: "Running", station: "MTJ", next: "NDLS", speed: 104, delay: 4, eta: "01:05", type: "Rajdhani", priority: 1, progress: 0.45 },
  { no: "12431", name: "Trivandrum Rajdhani", status: "Halted", station: "RTM", next: "KOTA", speed: 0, delay: 15, eta: "02:58", type: "Rajdhani", priority: 2, progress: 0 },
  { no: "12432", name: "Hazrat Nizamuddin Rajdhani", status: "Running", station: "ST", next: "BRC", speed: 118, delay: 2, eta: "04:20", type: "Rajdhani", priority: 1, progress: 0.7 },
  { no: "19019", name: "Bandra–Haridwar Express", status: "Running", station: "BCT", next: "ST", speed: 88, delay: 0, eta: "05:02", type: "Express", priority: 3, progress: 0.2 },
  { no: "59601", name: "Freight Container", status: "Running", station: "AGC", next: "NDLS", speed: 64, delay: 11, eta: "06:14", type: "Freight", priority: 3, progress: 0.25 },
  { no: "12834", name: "Howrah Express", status: "Running", station: "CNB", next: "DDU", speed: 110, delay: 5, eta: "08:15", type: "Express", priority: 1, progress: 0.4 },
  { no: "12616", name: "Grand Trunk Express", status: "Running", station: "MTJ", next: "AGC", speed: 105, delay: 12, eta: "03:45", type: "Express", priority: 2, progress: 0.8 },
  { no: "12270", name: "Duronto Express", status: "Running", station: "NGP", next: "SC", speed: 125, delay: 0, eta: "04:30", type: "Rajdhani", priority: 1, progress: 0.6 },
  { no: "12840", name: "Chennai Mail", status: "Running", station: "MAS", next: "SBC", speed: 90, delay: 25, eta: "06:20", type: "Express", priority: 2, progress: 0.1 },
  { no: "12001", name: "Bhopal Shatabdi", status: "Running", station: "BPL", next: "AGC", speed: 130, delay: 0, eta: "01:10", type: "Shatabdi", priority: 1, progress: 0.9 },
  { no: "12301", name: "Kolkata Rajdhani", status: "Running", station: "HWH", next: "DDU", speed: 115, delay: 8, eta: "10:05", type: "Rajdhani", priority: 1, progress: 0.15 },
];

/* ----------------------------- Assets ----------------------------- */
export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  status: Status;
  health: number;
  util: number;
  lastInspection: string;
}
export const assets: Asset[] = [
  { id: "AST-101", name: "Bandra–Worli Viaduct", type: "Bridge", location: "Bandra, Mumbai", status: "operational", health: 95, util: 90, lastInspection: "12 Aug 2026" },
  { id: "AST-102", name: "CTC Equipment", type: "Communication", location: "Vadodara Junction", status: "operational", health: 91, util: 85, lastInspection: "08 Aug 2026" },
  { id: "AST-103", name: "Level Crossing 23", type: "Level Crossing", location: "Agra Section", status: "operational", health: 78, util: 70, lastInspection: "01 Aug 2026" },
  { id: "AST-104", name: "OHE Feeder — Kota", type: "OHE", location: "Kota Junction", status: "maintenance", health: 62, util: 40, lastInspection: "20 Aug 2026" },
  { id: "AST-105", name: "Signal S-42", type: "Signal", location: "Mathura Junction", status: "operational", health: 88, util: 77, lastInspection: "15 Aug 2026" },
  { id: "AST-106", name: "Platform 3 — New Delhi", type: "Platform", location: "New Delhi", status: "degraded", health: 71, util: 96, lastInspection: "10 Aug 2026" },
  { id: "AST-107", name: "Track RS005 (Kota–Agra)", type: "Track", location: "RS005 · km 12.5", status: "maintenance", health: 44, util: 0, lastInspection: "22 Aug 2026" },
  { id: "AST-108", name: "Interlocking Panel — Ratlam", type: "Signal", location: "Ratlam Junction", status: "operational", health: 84, util: 81, lastInspection: "18 Aug 2026" },
  { id: "AST-109", name: " axle-counter bank — Surat", type: "Detection", location: "Surat", status: "operational", health: 90, util: 73, lastInspection: "09 Aug 2026" },
  { id: "AST-110", name: "OHE Tension Tower", type: "OHE", location: "Sawai Madhopur", status: "offline", health: 23, util: 0, lastInspection: "30 Jul 2026" },
];

/* ----------------------------- Conflicts ----------------------------- */
export interface Conflict {
  id: string;
  title: string;
  section: string;
  severity: Severity;
  status: "Active" | "Acknowledged" | "Resolved";
  minsTo: number;
  trains: string[];
  risk: Severity;
}
export const conflicts: Conflict[] = [
  { id: "CF001", title: "Block Conflict", section: "Kota–Agra Section", severity: "critical", status: "Active", minsTo: 45, trains: ["12951", "12009"], risk: "critical" },
  { id: "CF002", title: "Schedule Overlap", section: "Mathura–New Delhi", severity: "critical", status: "Active", minsTo: 18, trains: ["12952", "59601"], risk: "high" },
  { id: "CF003", title: "Platform Contention", section: "Vadodara Junction", severity: "high", status: "Acknowledged", minsTo: 92, trains: ["12953", "12432"], risk: "medium" },
  { id: "CF004", title: "Path Crossing", section: "Ratlam–Kota", severity: "medium", status: "Resolved", minsTo: 0, trains: ["12431"], risk: "low" },
];

/* ----------------------------- AI Recommendations ----------------------------- */
export interface Recommendation {
  id: string;
  status: RecStatus;
  scope: string;
  title: string;
  body: string;
  confidence: number;
  delay: number;
  affected: number;
  reason?: string;
}
export const recommendations: Recommendation[] = [
  {
    id: "AI001",
    status: "pending",
    scope: "Western Main Line",
    title: "Hold 12951 Rajdhani at Kota Junction",
    body: "Hold 12951 Rajdhani at Kota Junction for 20 minutes, then dispatch using alternative block timing to allow 12009 Shatabdi to pass first.",
    confidence: 87,
    delay: 20,
    affected: 2,
  },
  {
    id: "AI002",
    status: "pending",
    scope: "Mathura–New Delhi",
    title: "Speed restriction for 12952",
    body: "Apply a 15 km/h temporary speed restriction on 12952 between Mathura and New Delhi to ease platform contention at NDLS.",
    confidence: 79,
    delay: 9,
    affected: 1,
  },
  {
    id: "AI003",
    status: "accepted",
    scope: "Vadodara Junction",
    title: "Reassign Platform 5 to 12953",
    body: "Reassign August Kranti Rajdhani to Platform 5 at Vadodara to relieve cascading delays from 12432.",
    confidence: 92,
    delay: 4,
    affected: 2,
  },
];

/* ----------------------------- Alerts ----------------------------- */
export interface Alert {
  id: string;
  severity: Severity;
  title: string;
  desc: string;
  location: string;
  train?: string;
  ts: number;
  status: "Unread" | "Read" | "Acknowledged" | "Resolved";
  clearance?: string;
  affected?: string[];
}
const now = Date.now();
export const alerts: Alert[] = [
  { id: "AL001", severity: "critical", title: "Block section unavailable: Kota–Agra", desc: "Section RS005 blocked due to emergency track inspection.", location: "RS005 · Kota–Agra", train: "12951", ts: now - 1000 * 60 * 4, status: "Unread", clearance: "2 hours", affected: ["12951 Mumbai Rajdhani", "12009 Shatabdi"] },
  { id: "AL002", severity: "critical", title: "Signal failure — Mathura S-42", desc: "Signal S-42 reported non-functional; manual passing issued.", location: "Mathura Junction", train: "12952", ts: now - 1000 * 60 * 22, status: "Unread", clearance: "45 min", affected: ["12952 New Delhi Rajdhani"] },
  { id: "AL003", severity: "high", title: "OHE voltage dip — Kota feeder", desc: "Voltage dip detected on OHE feeder near Kota Junction.", location: "Kota Junction", ts: now - 1000 * 60 * 48, status: "Acknowledged", clearance: "30 min" },
  { id: "AL004", severity: "medium", title: "Platform crowding — New Delhi P3", desc: "Platform 3 at NDLS operating above 95% utilization.", location: "New Delhi", ts: now - 1000 * 60 * 90, status: "Read" },
  { id: "AL005", severity: "low", title: "Late advisory — 12431 Trivandrum", desc: "Rajdhani running 15 min behind schedule approaching Ratlam.", location: "Ratlam Junction", train: "12431", ts: now - 1000 * 60 * 130, status: "Read" },
  { id: "AL006", severity: "high", title: "Track geometry alert — km 12.5", desc: "Automated track monitoring flagged fishplate joint for review.", location: "RS005 · km 12.5", ts: now - 1000 * 60 * 200, status: "Resolved" },
];

/* ----------------------------- Maintenance ----------------------------- */
export interface Maintenance {
  id: string;
  section: string;
  title: string;
  desc: string;
  status: "Active" | "Upcoming" | "Completed";
  type: "Emergency" | "Planned" | "Renewal" | "Inspection";
  window: string;
  downtime: string;
  impact: string;
  team: string;
}
export const maintenance: Maintenance[] = [
  { id: "MT-001", section: "Track Section RS005 — Kota–Agra", title: "Emergency fishplate repair", desc: "Emergency repair of broken rail fishplate joint at km 12.5.", status: "Active", type: "Emergency", window: "23–24 Aug 2026", downtime: "12h downtime", impact: "Block section closed. 5 trains rerouted or delayed.", team: "Track Maintenance — Kota Division" },
  { id: "MT-002", section: "OHE Feeder — Kota Junction", title: "Feeder cable replacement", desc: "Scheduled replacement of ageing OHE feeder cable at Kota.", status: "Active", type: "Planned", window: "23–23 Aug 2026", downtime: "6h downtime", impact: "Single-line working. 3 trains affected.", team: "OHE Crew — Kota" },
  { id: "MT-003", section: "Signal S-42 — Mathura", title: "Aspect unit recalibration", desc: "Recalibration of signal aspect unit after reported failure.", status: "Upcoming", type: "Inspection", window: "25 Aug 2026", downtime: "3h downtime", impact: "Caution order to be issued. Minimal impact.", team: "S&T — Delhi Division" },
  { id: "MT-004", section: "Track RS004 — Ratlam–Kota", title: "Through rail renewal", desc: "3.2 km rail renewal between Ratlam and Kota.", status: "Completed", type: "Renewal", window: "18–19 Aug 2026", downtime: "16h downtime", impact: "Completed ahead of schedule. Block released.", team: "Track Renewal — Ratlam" },
];

/* ----------------------------- Data feeds ----------------------------- */
export interface DataFeed {
  id: string;
  abbr: string;
  name: string;
  status: "Connected" | "Degraded" | "Pending" | "Failed";
  latency: number;
  volume: string;
  completeness: number;
  lastSync: string;
  desc: string;
}
export const dataFeeds: DataFeed[] = [
  { id: "COA", abbr: "COA", name: "Control Office Application", status: "Connected", latency: 42, volume: "2.4M", completeness: 99.8, lastSync: "12s ago", desc: "Real-time train control & movement data" },
  { id: "FOIS", abbr: "FOIS", name: "Freight Operations Info System", status: "Connected", latency: 88, volume: "1.9M", completeness: 99.4, lastSync: "31s ago", desc: "Freight rake & consignment data" },
  { id: "ICMS", abbr: "ICMS", name: "Integrated Coaching Management", status: "Connected", latency: 54, volume: "1.1M", completeness: 98.9, lastSync: "18s ago", desc: "Coaching stock & rake composition" },
  { id: "TMS", abbr: "TMS", name: "Track Management System", status: "Degraded", latency: 320, volume: "0.8M", completeness: 94.1, lastSync: "4m ago", desc: "Track geometry & asset telemetry" },
  { id: "NTES", abbr: "NTES", name: "UTS / NTES Public Feed", status: "Connected", latency: 120, volume: "1.6M", completeness: 99.1, lastSync: "27s ago", desc: "Public running status aggregation" },
  { id: "EDR", abbr: "e-Drishti", name: "e-Drishti MIS", status: "Pending", latency: 0, volume: "—", completeness: 0, lastSync: "Reconciling", desc: "Executive monitoring & analytics" },
];

export const lineage = [
  { label: "COA / FOIS / ICMS", sub: "Source systems" },
  { label: "Ingestion Bus", sub: "Stream processor" },
  { label: "Feature Store", sub: "Operational model" },
  { label: "Planning Engine", sub: "v4.2 · optimizer" },
  { label: "COA Publish", sub: "Control feedback" },
];

/* ----------------------------- Tickets ----------------------------- */
export interface Ticket {
  id: string;
  title: string;
  priority: Severity;
  points: number;
  assignee: string;
  zone: string;
  status: "todo" | "progress" | "review" | "done";
}
export const tickets: Ticket[] = [
  { id: "IRB-1039", title: "Tamper T-14 unavailable — update resource registry", priority: "critical", points: 3, assignee: "R. Chauhan", zone: "SR", status: "todo" },
  { id: "IRB-1021", title: "Zonal availability dashboard shows stale COA data", priority: "medium", points: 3, assignee: "M. Verma", zone: "WR", status: "todo" },
  { id: "IRB-1044", title: "Block RS005 fishplate — verify repair log entry", priority: "high", points: 5, assignee: "A. Patil", zone: "WCR", status: "progress" },
  { id: "IRB-1040", title: "AI confidence model drift > threshold", priority: "high", points: 8, assignee: "S. Iyer", zone: "NR", status: "progress" },
  { id: "IRB-1033", title: "Reconcile NTES punctuality feed mismatch", priority: "low", points: 2, assignee: "M. Verma", zone: "WR", status: "review" },
  { id: "IRB-1029", title: "Add caution-order template to e-Fill", priority: "medium", points: 5, assignee: "R. Chauhan", zone: "SR", status: "review" },
  { id: "IRB-1018", title: "Signal S-42 interlocking test sign-off", priority: "critical", points: 3, assignee: "A. Patil", zone: "NR", status: "done" },
  { id: "IRB-1011", title: "Migrate feed latency thresholds to config", priority: "low", points: 2, assignee: "S. Iyer", zone: "NR", status: "done" },
];

/* ----------------------------- Activity feed ----------------------------- */
export interface Activity {
  id: string;
  who: string;
  initials: string;
  tone: string;
  action: string;
  target: string;
  ts: number;
}
export const activity: Activity[] = [
  { id: "AC1", who: "R. Sharma", initials: "RS", tone: "ack", action: "acknowledged conflict", target: "Block Conflict CF001 — Kota-Agra Section", ts: now - 1000 * 60 * 3 },
  { id: "AC2", who: "System", initials: "AI", tone: "ai", action: "generated recommendation", target: "AI001 — Hold 12951 at Kota Junction", ts: now - 1000 * 60 * 9 },
  { id: "AC3", who: "A. Patil", initials: "AP", tone: "accept", action: "accepted AI recommendation", target: "AI002 — Speed restriction for 12953", ts: now - 1000 * 60 * 17 },
  { id: "AC4", who: "M. Verma", initials: "MV", tone: "file", action: "filed e-Fill form", target: "E-1 Block Requisition · BR-2087", ts: now - 1000 * 60 * 31 },
  { id: "AC5", who: "System", initials: "AI", tone: "ai", action: "resolved schedule overlap", target: "CF003 — Vadodara Platform 5 reassign", ts: now - 1000 * 60 * 44 },
  { id: "AC6", who: "S. Iyer", initials: "SI", tone: "resolve", action: "resolved ticket", target: "IRB-1018 — Signal S-42 sign-off", ts: now - 1000 * 60 * 70 },
];

/* ----------------------------- Team ----------------------------- */
export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  online: boolean;
  status: string;
}
export const team: TeamMember[] = [
  { initials: "RS", name: "Rajesh Sharma", role: "Section Controller", online: true, status: "In control room" },
  { initials: "MV", name: "Meena Verma", role: "Station Master", online: true, status: "Typing…" },
  { initials: "AP", name: "Arun Patil", role: "Section Controller", online: true, status: "On call — Kota" },
  { initials: "SI", name: "Sneha Iyer", role: "Operations Analyst", online: false, status: "Last seen 12m ago" },
  { initials: "RC", name: "Rohan Chauhan", role: "Den Inspector", online: true, status: "Available" },
];

/* ----------------------------- Collaboration chat ----------------------------- */
export interface Channel {
  id: string;
  name: string;
  icon: "users" | "wrench" | "radio" | "shield" | "track" | "siren";
  unread?: number;
  live?: boolean;
  danger?: boolean;
  participants: number;
  topic: string;
}
export const channels: Channel[] = [
  { id: "divisional", name: "Divisional Control", icon: "users", live: true, participants: 14, topic: "Divisional Control — Operational Thread" },
  { id: "maintenance", name: "Maintenance", icon: "wrench", participants: 9, topic: "Maintenance — Block Execution" },
  { id: "ohe", name: "OHE", icon: "radio", participants: 6, topic: "OHE — Power Block Coordination" },
  { id: "signal", name: "Signal", icon: "shield", unread: 1, participants: 7, topic: "Signal & Telecom — S&T Desk" },
  { id: "track", name: "Track", icon: "track", participants: 11, topic: "Track Engineering — P.Way Desk" },
  { id: "emergency", name: "Emergency Ops", icon: "siren", unread: 2, danger: true, participants: 5, topic: "Emergency Ops — Critical Response" },
];

export interface ChatMessage {
  id: string;
  author: string;
  initials: string;
  time: string;
  body: string;
  ai?: boolean;
  tag?: string;
  action?: string;
  own?: boolean;
}
export const channelMessages: Record<string, ChatMessage[]> = {
  divisional: [
    { id: "m1", author: "Arjun Mehta", initials: "AM", time: "02:45", body: "OHE team confirms availability from 03:20. The revised possession can proceed without affecting premium services." },
    { id: "m2", author: "Priya Nair", initials: "PN", time: "02:48", body: "Crew 04 can complete the work in 42 minutes. Requesting a 45-minute protected window for clearance." },
    { id: "m3", author: "MARGA AI", initials: "AI", time: "02:49", body: "Updated plan generated with 96.7% confidence based on current operational telemetry.", ai: true, tag: "Automated proposal", action: "Review proposed block" },
    { id: "m4", author: "Rohan Singh", initials: "RS", time: "02:52", body: "Plan approved. Please notify the GZB desk and retain the freight bypass as contingency.", action: "Open operational context", own: true },
  ],
  maintenance: [
    { id: "m1", author: "Rohan Chauhan", initials: "RC", time: "01:12", body: "Tamping machine T-14 is under repair at Kota shed. ETA for release is 06:00." },
    { id: "m2", author: "MARGA AI", initials: "AI", time: "01:15", body: "Reallocating BLK-4451 to Crew 07 maintains 91% asset availability without schedule slip.", ai: true, tag: "Resource reallocation", action: "Apply reallocation" },
    { id: "m3", author: "Meena Verma", initials: "MV", time: "01:22", body: "Confirmed. Crew 07 briefed and mobilising to MGS–BSB section." },
  ],
  ohe: [
    { id: "m1", author: "Sneha Iyer", initials: "SI", time: "23:40", body: "Power block requested on ST–BL for mast replacement. Isolation sheet is being prepared." },
    { id: "m2", author: "Arjun Mehta", initials: "AM", time: "23:47", body: "TPC has cleared isolation from 02:00. Earthing to be verified before crew entry." },
    { id: "m3", author: "MARGA AI", initials: "AI", time: "23:51", body: "Overlap detected with 12951 Rajdhani path. Recommend shifting block start to 02:15.", ai: true, tag: "Conflict advisory", action: "View conflict" },
  ],
  signal: [
    { id: "m1", author: "Priya Nair", initials: "PN", time: "20:05", body: "Signal S-42 at Mathura reported non-functional. Manual passing authority issued to 3 trains." },
    { id: "m2", author: "Rohan Chauhan", initials: "RC", time: "20:14", body: "S&T team dispatched. Aspect unit recalibration scheduled for 25 Aug." },
  ],
  track: [
    { id: "m1", author: "Meena Verma", initials: "MV", time: "18:30", body: "Track geometry car flagged a Class-B defect at km 12.5 on RS005." },
    { id: "m2", author: "MARGA AI", initials: "AI", time: "18:33", body: "Recommend a 30 km/h temporary speed restriction until fishplate welding is completed.", ai: true, tag: "Safety advisory", action: "Issue caution order" },
    { id: "m3", author: "Rohan Singh", initials: "RS", time: "18:40", body: "Caution order issued and acknowledged by all drivers on section.", own: true },
  ],
  emergency: [
    { id: "m1", author: "Rohan Singh", initials: "RS", time: "19:58", body: "Rail fracture reported on NDLS–PWL at km 12.5. Section closed to all traffic.", own: true },
    { id: "m2", author: "MARGA AI", initials: "AI", time: "19:59", body: "5 trains impacted. Diversion via Ghaziabad loop minimises network delay to 22 minutes.", ai: true, tag: "Emergency response", action: "Execute diversion" },
    { id: "m3", author: "Arjun Mehta", initials: "AM", time: "20:03", body: "Emergency gang mobilised from Palwal. Estimated clearance in 2 hours." },
  ],
};

export interface OpDetail {
  blockId: string;
  section: string;
  status: string;
  crew: string;
  supervisor: string;
}
export const opDetails: Record<string, OpDetail> = {
  divisional: { blockId: "BLK-2048", section: "NDLS–GZB", status: "Approved", crew: "OHE Team 04", supervisor: "Available" },
  maintenance: { blockId: "BLK-4451", section: "MGS–BSB", status: "Approved", crew: "Crew 07", supervisor: "Available" },
  ohe: { blockId: "BLK-4421", section: "ST–BL", status: "Pending", crew: "OHE Crew — Surat", supervisor: "On site" },
  signal: { blockId: "BLK-4478", section: "MTJ–AGC", status: "Approved", crew: "S&T — Agra", supervisor: "Available" },
  track: { blockId: "BLK-4412", section: "PWL–MTJ", status: "Approved", crew: "Track Maint. — Kota", supervisor: "Available" },
  emergency: { blockId: "BLK-4440", section: "NDLS–PWL", status: "Provisional", crew: "Emergency — Delhi", supervisor: "On site" },
};

export interface DecisionEvent {
  time: string;
  title: string;
  sub: string;
  tone: "green" | "blue" | "amber";
}
export const decisionHistory: DecisionEvent[] = [
  { time: "02:52", title: "Plan approved", sub: "Digitally acknowledged by OP-77X", tone: "green" },
  { time: "02:50", title: "AI block proposed", sub: "Confidence 96.7%", tone: "blue" },
  { time: "02:30", title: "Block request initiated", sub: "Maintenance Engineering", tone: "amber" },
  { time: "02:15", title: "Shift handover completed", sub: "NDLS control desk", tone: "blue" },
];

export const attachments = [
  { name: "Maintenance Protocol.pdf", size: "2.4 MB" },
  { name: "OHE Technical Spec.v2", size: "1.1 MB" },
  { name: "Block Requisition E-1.pdf", size: "684 KB" },
];

/* ----------------------------- Interventions ----------------------------- */
export interface Intervention {
  id: string;
  action: string;
  operator: string;
  ts: string;
  status: "Executed" | "Pending Review" | "Reverted";
  result: string;
  severity: Severity;
}
export const interventions: Intervention[] = [
  { id: "INT-051", action: "Manual speed restriction applied", operator: "R. Sharma", ts: "23 Aug 2026, 7:58 PM", status: "Executed", result: "Speed restriction accepted by driver.", severity: "high" },
  { id: "INT-050", action: "Dispatch hold released for 12009", operator: "A. Patil", ts: "23 Aug 2026, 7:41 PM", status: "Executed", result: "Train departed Mathura on schedule.", severity: "medium" },
  { id: "INT-049", action: "AI recommendation overridden", operator: "M. Verma", ts: "23 Aug 2026, 7:12 PM", status: "Pending Review", result: "Awaiting DEN acknowledgement.", severity: "critical" },
  { id: "INT-048", action: "Caution order issued km 12.5", operator: "R. Chauhan", ts: "23 Aug 2026, 6:48 PM", status: "Executed", result: "Driver acknowledged caution.", severity: "high" },
];

/* ----------------------------- e-Fill forms ----------------------------- */
export interface EForm {
  ref: string;
  form: string;
  zone: string;
  status: "Approved" | "Pending DEN" | "Under Review" | "Rejected";
  filed: string;
  type: string;
}
export const eForms: EForm[] = [
  { ref: "BR-2087", form: "Block Requisition (Form E-1)", zone: "Western", status: "Pending DEN", filed: "23 Aug 2026", type: "Block Requisition" },
  { ref: "BR-2071", form: "Caution Order Advice", zone: "North Central", status: "Under Review", filed: "22 Aug 2026", type: "Caution Order" },
  { ref: "BR-2054", form: "Override Justification", zone: "Western", status: "Approved", filed: "21 Aug 2026", type: "Override" },
  { ref: "BR-2033", form: "Block Requisition (Form E-1)", zone: "Northern", status: "Rejected", filed: "20 Aug 2026", type: "Block Requisition" },
  { ref: "BR-2019", form: "Caution Order Advice", zone: "West Central", status: "Approved", filed: "19 Aug 2026", type: "Caution Order" },
];

/* ----------------------------- Block schedule ----------------------------- */
export type BlockType = "Maintenance" | "Renewal" | "Inspection" | "Emergency";
export interface Block {
  id: string;
  section: string;
  corridor: string;
  day: number; // 0-6 (Mon..Sun)
  start: number; // hour, fractional (e.g. 1.5 = 01:30)
  end: number; // hour
  type: BlockType;
  team: string;
  trains: number;
  conflict: boolean;
  status: "Approved" | "Pending" | "Provisional";
  confidence: number;
  work: string;
}
export const blocks: Block[] = [
  { id: "BLK-4412", section: "PWL–MTJ", corridor: "Northern", day: 0, start: 1.5, end: 4.5, type: "Maintenance", team: "Track Maint. — Kota", trains: 3, conflict: false, status: "Approved", confidence: 92, work: "Ballast cleaning & tamping, km 42–48" },
  { id: "BLK-4418", section: "DDU–GCT", corridor: "East Central", day: 0, start: 10, end: 13, type: "Renewal", team: "Renewal — DDU", trains: 5, conflict: false, status: "Approved", confidence: 88, work: "Through rail renewal, 2.4 km stretch" },
  { id: "BLK-4421", section: "ST–BL", corridor: "Western", day: 1, start: 2, end: 6, type: "Renewal", team: "OHE Crew — Surat", trains: 5, conflict: true, status: "Pending", confidence: 74, work: "OHE mast replacement & rewiring" },
  { id: "BLK-4427", section: "AJJ–KPD", corridor: "Southern", day: 1, start: 13.5, end: 16, type: "Inspection", team: "S&T — Arakkonam", trains: 2, conflict: false, status: "Approved", confidence: 95, work: "Signal interlocking inspection" },
  { id: "BLK-4433", section: "BZA–GNT", corridor: "South Central", day: 2, start: 0.5, end: 3.5, type: "Maintenance", team: "Track Maint. — Vijayawada", trains: 4, conflict: false, status: "Approved", confidence: 90, work: "Points & crossings overhaul" },
  { id: "BLK-4440", section: "NDLS–PWL", corridor: "Northern", day: 2, start: 11, end: 14.5, type: "Emergency", team: "Emergency — Delhi", trains: 9, conflict: true, status: "Provisional", confidence: 68, work: "Emergency rail fracture repair, km 12.5" },
  { id: "BLK-4451", section: "MGS–BSB", corridor: "North Eastern", day: 3, start: 3, end: 7, type: "Maintenance", team: "Track Maint. — Mughalsarai", trains: 6, conflict: false, status: "Approved", confidence: 86, work: "Deep screening of formation" },
  { id: "BLK-4455", section: "BRC–ANND", corridor: "Western", day: 3, start: 14, end: 17, type: "Inspection", team: "S&T — Vadodara", trains: 3, conflict: false, status: "Approved", confidence: 93, work: "Track geometry recording run" },
  { id: "BLK-4462", section: "KPD–JTJ", corridor: "Southern", day: 4, start: 1, end: 5, type: "Renewal", team: "Renewal — Katpadi", trains: 4, conflict: false, status: "Approved", confidence: 89, work: "Sleeper renewal, 3.1 km" },
  { id: "BLK-4470", section: "SC–KZJ", corridor: "South Central", day: 4, start: 9.5, end: 12, type: "Maintenance", team: "OHE Crew — Secunderabad", trains: 5, conflict: true, status: "Pending", confidence: 71, work: "OHE tension adjustment" },
  { id: "BLK-4478", section: "MTJ–AGC", corridor: "North Central", day: 5, start: 2.5, end: 6, type: "Maintenance", team: "Track Maint. — Agra", trains: 4, conflict: false, status: "Approved", confidence: 91, work: "Fishplate joint welding" },
  { id: "BLK-4483", section: "GCT–MGS", corridor: "North Eastern", day: 6, start: 4, end: 8.5, type: "Renewal", team: "Renewal — Ghazipur", trains: 6, conflict: false, status: "Approved", confidence: 85, work: "Bridge girder strengthening" },
  { id: "BLK-4491", section: "RTM–KOTA", corridor: "West Central", day: 5, start: 13, end: 16.5, type: "Inspection", team: "S&T — Ratlam", trains: 2, conflict: false, status: "Approved", confidence: 94, work: "Level crossing gate inspection" },
  { id: "BLK-4495", section: "BPL–ET", corridor: "West Central", day: 6, start: 13, end: 17, type: "Maintenance", team: "Track Maint. — Bhopal", trains: 5, conflict: false, status: "Pending", confidence: 79, work: "Curve realignment works" },
];

/* ----------------------------- Analytics series ----------------------------- */
export function punctualitySeries(days: number) {
  const base = [92, 90, 94, 91, 88, 85, 90, 93, 91, 89, 86, 84, 88, 91, 90, 89, 87, 90, 92, 91, 88, 86, 89, 91, 90, 93, 95, 92, 91, 90];
  const slice = base.slice(-days);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return slice.map((v, i) => ({ label: labels[i % 7], punctuality: v, target: 90 }));
}
export function delaySeries(days: number) {
  const base = [8, 10, 7, 9, 13, 16, 11, 9, 10, 12, 15, 18, 14, 11, 12, 13, 15, 12, 10, 11, 14, 16, 13, 11, 12, 9, 7, 10, 11, 12];
  return base.slice(-days).map((v, i) => ({ label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7], delay: v }));
}
export function utilizationSeries(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    label: `W${i + 1}`,
    maintenance: 30 + Math.round(Math.sin(i) * 8) + i,
    renewal: 18 + Math.round(Math.cos(i) * 6) + Math.round(i / 2),
    inspection: 12 + (i % 4) * 3,
  }));
}
export function assetHealthDist() {
  return [
    { name: "Healthy", value: 74, color: "#18845B" },
    { name: "Watch", value: 16, color: "#C98218" },
    { name: "Degraded", value: 7, color: "#1557A6" },
    { name: "Critical", value: 3, color: "#D64545" },
  ];
}
export function acceptanceSeries(days: number) {
  const base = [62, 66, 64, 70, 74, 71, 76, 78, 75, 80, 83, 81, 84];
  return base.slice(-days).map((v, i) => ({ label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7], rate: v }));
}

/* ----------------------------- KPI summary ----------------------------- */
export const kpis = {
  activeTrains: 16,
  activeTrainsDelayed: 7,
  avgDelay: 12,
  avgDelayDelta: -3.2,
  activeConflicts: 2,
  activeConflictsCritical: 2,
  assetHealth: 74,
  aiRecs: 2,
  aiRecsPending: 1,
  avgSpeed: 76,
  executedToday: 14,
  interventions: 1,
  pendingReview: 1,
};

export const statusChecks = [
  { label: "Operational Data", value: "Available", ok: true },
  { label: "Simulation Engine", value: "Running", ok: true },
  { label: "Notification Pipeline", value: "Healthy", ok: true },
  { label: "Frontend Diagnostics", value: "No active faults", ok: true },
];

export const explainInputs = [
  { label: "Train positions & speeds", weight: 22, note: "Live COA feed" },
  { label: "Track block status", weight: 19, note: "RS005 unavailable" },
  { label: "Repair ETA", weight: 12, note: "~2h to clearance" },
  { label: "Train priority", weight: 14, note: "12009 > 12951" },
  { label: "Historical traffic", weight: 11, note: "90-day window" },
  { label: "Station capacity", weight: 9, note: "Kota holding ok" },
  { label: "Weather", weight: 6, note: "Clear corridor" },
  { label: "Asset availability", weight: 7, note: "Crew confirmed" },
];

export const confidenceBreakdown = [
  { label: "Train position certainty", value: 94 },
  { label: "Block availability certainty", value: 82 },
  { label: "Traffic prediction", value: 79 },
  { label: "Asset availability", value: 88 },
  { label: "Historical model accuracy", value: 85 },
];

export const reasoning = [
  { step: 1, text: "Block RS005 unavailable", detail: "Emergency inspection closes Kota–Mathura corridor." },
  { step: 2, text: "12009 has higher priority", detail: "Shatabdi precedence overrides Rajdhani on shared path." },
  { step: 3, text: "12951 has holding capacity", detail: "Kota Junction has 3 free platforms for 20 min." },
  { step: 4, text: "Alternative path available", detail: "Dispatch on shifted block timing after 20 min hold." },
  { step: 5, text: "Expected network delay minimized", detail: "20 min vs projected 38 min cascading delay." },
];
