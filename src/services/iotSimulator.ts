import { SmartBin } from '../types';

export const INITIAL_BINS: SmartBin[] = [
  {
    id: 'BIN-101',
    name: 'Smart Bin #101',
    location: 'Central Railway Station (Platform 1 Exit)',
    zone: 'Transit & Commercial',
    coordinates: { x: 22, y: 34, lat: 28.6139, lng: 77.2090 },
    wasteType: 'Dry / Recyclable',
    fillLevel: 88,
    capacityLiters: 240,
    temperature: 31,
    humidity: 58,
    gasPpm: 92,
    odourLevel: 'Moderate',
    batteryLevel: 82,
    solarCharging: true,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'sanitary',
    lastSanitized: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    lastUpdated: 'Just now',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:10',
      ipAddress: '192.168.1.101'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 45, temperature: 27, gasPpm: 40 },
      { timestamp: '10:00', fillLevel: 62, temperature: 29, gasPpm: 60 },
      { timestamp: '12:00', fillLevel: 76, temperature: 32, gasPpm: 80 },
      { timestamp: '14:00', fillLevel: 88, temperature: 31, gasPpm: 92 }
    ]
  },
  {
    id: 'BIN-102',
    name: 'Smart Bin #102',
    location: 'Municipal Vegetable & Fruit Market',
    zone: 'Market & Bazaar',
    coordinates: { x: 68, y: 28, lat: 28.6210, lng: 77.2155 },
    wasteType: 'Wet / Organic',
    fillLevel: 96,
    capacityLiters: 360,
    temperature: 41,
    humidity: 89,
    gasPpm: 275,
    odourLevel: 'Hazardous',
    batteryLevel: 74,
    solarCharging: true,
    lidStatus: 'open',
    tiltAlarm: false,
    sanitizationStatus: 'urgent_needed',
    lastSanitized: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    lastUpdated: '1 min ago',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:12',
      ipAddress: '192.168.1.102'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 55, temperature: 32, gasPpm: 110 },
      { timestamp: '10:00', fillLevel: 74, temperature: 36, gasPpm: 180 },
      { timestamp: '12:00', fillLevel: 88, temperature: 39, gasPpm: 230 },
      { timestamp: '14:00', fillLevel: 96, temperature: 41, gasPpm: 275 }
    ]
  },
  {
    id: 'BIN-103',
    name: 'Smart Bin #103',
    location: 'District Civil Hospital Campus',
    zone: 'Healthcare Facility',
    coordinates: { x: 42, y: 72, lat: 28.6050, lng: 77.2280 },
    wasteType: 'Hazardous / E-Waste',
    fillLevel: 64,
    capacityLiters: 180,
    temperature: 24,
    humidity: 48,
    gasPpm: 120,
    odourLevel: 'Moderate',
    batteryLevel: 91,
    solarCharging: true,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'due',
    lastSanitized: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    lastUpdated: 'Just now',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:15',
      ipAddress: '192.168.1.103'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 30, temperature: 22, gasPpm: 60 },
      { timestamp: '10:00', fillLevel: 42, temperature: 23, gasPpm: 85 },
      { timestamp: '12:00', fillLevel: 55, temperature: 24, gasPpm: 105 },
      { timestamp: '14:00', fillLevel: 64, temperature: 24, gasPpm: 120 }
    ]
  },
  {
    id: 'BIN-104',
    name: 'Smart Bin #104',
    location: 'Cyber City IT Tech Hub (Tower C)',
    zone: 'Commercial Office',
    coordinates: { x: 78, y: 65, lat: 28.6290, lng: 77.2340 },
    wasteType: 'Dry / Recyclable',
    fillLevel: 42,
    capacityLiters: 240,
    temperature: 25,
    humidity: 50,
    gasPpm: 45,
    odourLevel: 'Low',
    batteryLevel: 16, // Low battery for demo
    solarCharging: false,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'sanitary',
    lastSanitized: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    lastUpdated: '4 mins ago',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:20',
      ipAddress: '192.168.1.104'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 15, temperature: 23, gasPpm: 30 },
      { timestamp: '10:00', fillLevel: 25, temperature: 24, gasPpm: 38 },
      { timestamp: '12:00', fillLevel: 35, temperature: 25, gasPpm: 42 },
      { timestamp: '14:00', fillLevel: 42, temperature: 25, gasPpm: 45 }
    ]
  },
  {
    id: 'BIN-105',
    name: 'Smart Bin #105',
    location: 'City Sports Complex & Stadium',
    zone: 'Public Recreation',
    coordinates: { x: 18, y: 78, lat: 28.6010, lng: 77.1950 },
    wasteType: 'General / Mixed',
    fillLevel: 78,
    capacityLiters: 360,
    temperature: 34,
    humidity: 62,
    gasPpm: 185,
    odourLevel: 'High',
    batteryLevel: 88,
    solarCharging: true,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'due',
    lastSanitized: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    lastUpdated: 'Just now',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:25',
      ipAddress: '192.168.1.105'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 40, temperature: 28, gasPpm: 70 },
      { timestamp: '10:00', fillLevel: 58, temperature: 31, gasPpm: 115 },
      { timestamp: '12:00', fillLevel: 68, temperature: 33, gasPpm: 150 },
      { timestamp: '14:00', fillLevel: 78, temperature: 34, gasPpm: 185 }
    ]
  },
  {
    id: 'BIN-106',
    name: 'Smart Bin #106',
    location: 'Residential Sector 9 Community Park',
    zone: 'Residential North',
    coordinates: { x: 52, y: 15, lat: 28.6350, lng: 77.2100 },
    wasteType: 'Wet / Organic',
    fillLevel: 35,
    capacityLiters: 240,
    temperature: 26,
    humidity: 55,
    gasPpm: 50,
    odourLevel: 'Low',
    batteryLevel: 94,
    solarCharging: true,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'sanitary',
    lastSanitized: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    lastUpdated: '2 mins ago',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:30',
      ipAddress: '192.168.1.106'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 10, temperature: 22, gasPpm: 25 },
      { timestamp: '10:00', fillLevel: 20, temperature: 24, gasPpm: 35 },
      { timestamp: '12:00', fillLevel: 28, temperature: 26, gasPpm: 45 },
      { timestamp: '14:00', fillLevel: 35, temperature: 26, gasPpm: 50 }
    ]
  },
  {
    id: 'BIN-107',
    name: 'Smart Bin #107',
    location: 'University Campus Student Union',
    zone: 'Education Hub',
    coordinates: { x: 85, y: 18, lat: 28.6380, lng: 77.2400 },
    wasteType: 'Dry / Recyclable',
    fillLevel: 91,
    capacityLiters: 240,
    temperature: 28,
    humidity: 52,
    gasPpm: 68,
    odourLevel: 'Low',
    batteryLevel: 65,
    solarCharging: true,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'sanitary',
    lastSanitized: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    lastUpdated: 'Just now',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:35',
      ipAddress: '192.168.1.107'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 35, temperature: 24, gasPpm: 30 },
      { timestamp: '10:00', fillLevel: 58, temperature: 26, gasPpm: 45 },
      { timestamp: '12:00', fillLevel: 75, temperature: 28, gasPpm: 55 },
      { timestamp: '14:00', fillLevel: 91, temperature: 28, gasPpm: 68 }
    ]
  },
  {
    id: 'BIN-108',
    name: 'Smart Bin #108',
    location: 'Metro Station North Concourse',
    zone: 'Transit & Commercial',
    coordinates: { x: 30, y: 55, lat: 28.6180, lng: 77.2020 },
    wasteType: 'General / Mixed',
    fillLevel: 82,
    capacityLiters: 360,
    temperature: 29,
    humidity: 59,
    gasPpm: 155,
    odourLevel: 'Moderate',
    batteryLevel: 78,
    solarCharging: false,
    lidStatus: 'closed',
    tiltAlarm: false,
    sanitizationStatus: 'due',
    lastSanitized: new Date(Date.now() - 49 * 3600 * 1000).toISOString(),
    lastCollected: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    lastUpdated: '1 min ago',
    hardwareSpecs: {
      mcu: 'ESP32-WROOM-32D (Dual-Core 240MHz)',
      ultrasonicSensor: 'JSN-SR04T Waterproof Ultrasonic',
      gasSensor: 'MQ-135 Hazardous Air & Ammonia',
      tempHumiditySensor: 'DHT22 Digital Sensor',
      firmwareVersion: 'v2.4.1-sih-build',
      macAddress: '24:6F:28:9B:4A:40',
      ipAddress: '192.168.1.108'
    },
    telemetryHistory: [
      { timestamp: '08:00', fillLevel: 30, temperature: 25, gasPpm: 50 },
      { timestamp: '10:00', fillLevel: 50, temperature: 27, gasPpm: 80 },
      { timestamp: '12:00', fillLevel: 68, temperature: 28, gasPpm: 120 },
      { timestamp: '14:00', fillLevel: 82, temperature: 29, gasPpm: 155 }
    ]
  }
];

export const ESP32_ARDUINO_SNIPPET = `// =================================================================
// Smart Waste Management & Sanitization - ESP32 Firmware Node
// Problem Statement ID: SIH26212 | Category: Hardware
// Libraries: WiFi.h, HTTPClient.h, ArduinoJson.h, DHT.h
// =================================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define BIN_ID "BIN-101"
#define API_ENDPOINT "https://ais-dev-ypqvp6ixbm53df2c33a4my-389741093671.asia-east1.run.app/api/iot/bin/" BIN_ID "/telemetry"

// Sensor Pin Definitions
#define TRIG_PIN 5        // JSN-SR04T Waterproof Ultrasonic Trigger
#define ECHO_PIN 18       // JSN-SR04T Ultrasonic Echo
#define DHTPIN 4          // DHT22 Temperature & Humidity Pin
#define DHTTYPE DHT22
#define MQ135_PIN 34      // MQ-135 Analog Gas/Ammonia Air Quality
#define BATTERY_PIN 35    // Voltage Divider for 18650 LiFePO4 Cell
#define UV_MIST_RELAY 23  // Relay for Automated Sanitization Spray Nozzle

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(UV_MIST_RELAY, OUTPUT);
  digitalWrite(UV_MIST_RELAY, LOW);
  
  dht.begin();
  WiFi.begin("MUNICIPAL_IOT_WIFI", "SmartCleanGreen2026");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected. Ready for telemetry stream.");
}

float measureFillPercentage() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.034 / 2.0;
  
  // Total bin height is 100 cm. Distance 10cm = 90% full; 90cm = 10% full.
  float fill = ((100.0 - distanceCm) / 90.0) * 100.0;
  return constrain(fill, 0.0, 100.0);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float fillLevel = measureFillPercentage();
    float temp = dht.readTemperature();
    float humidity = dht.readHumidity();
    int gasRaw = analogRead(MQ135_PIN);
    float gasPpm = map(gasRaw, 0, 4095, 20, 500); // PPM calibration curve
    float batteryVolts = (analogRead(BATTERY_PIN) / 4095.0) * 3.3 * 2.0;
    int batteryLevel = map(constrain(batteryVolts, 3.2, 4.2) * 100, 320, 420, 0, 100);

    StaticJsonDocument<256> doc;
    doc["binId"] = BIN_ID;
    doc["fillLevel"] = round(fillLevel);
    doc["temperature"] = round(temp);
    doc["humidity"] = round(humidity);
    doc["gasPpm"] = round(gasPpm);
    doc["batteryLevel"] = batteryLevel;
    doc["lidStatus"] = "closed";

    String requestBody;
    serializeJson(doc, requestBody);

    HTTPClient http;
    http.begin(API_ENDPOINT);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("Telemetry synced [%d]: %s\\n", httpResponseCode, response.c_str());
    }
    http.end();
  }
  // Deep sleep / transmission interval: 15 seconds
  delay(15000);
}
`;
