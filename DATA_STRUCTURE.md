# Data Structure for Departamento Pages

This document describes the expected data structure for departamento pages in the JSON file.

## Departamento Properties Structure

```json
{
  "properties": {
    "name": "San Salvador",
    "id": "san-salvador",
    "code": "SS",
    "capital": "San Salvador",
    "description": "The capital and largest city of El Salvador...",
    
    // Location Information
    "location": {
      "region": "Central Region",
      "coordinates": "13.6929° N, 89.2182° W",
      "area": "886.2 km²"
    },
    
    // Climate Information
    "climate": {
      "temperature": "20-30°C (68-86°F)",
      "rainfall": "1,800-2,000 mm annually",
      "season": "Dry season: November-April"
    },
    
    // Key Statistics
    "statistics": {
      "population": "2.4 million",
      "municipalities": "19",
      "elevation": "658 m (2,159 ft)"
    },
    
    // Best Time to Visit
    "bestTimeToVisit": "November to April (Dry season)",
    
    // Travel Tips
    "travelTips": [
      "Tip 1: Best time to visit is during dry season",
      "Tip 2: Bring sunscreen and light clothing",
      "Tip 3: Try local pupusas at traditional markets"
    ],
    
    // Highlights
    "highlights": [
      "Historic Downtown - Colonial architecture and museums",
      "El Boquerón - Volcanic crater with hiking trails",
      "Mercado Central - Traditional market experience"
    ],
    
    // Places to Visit
    "placesToVisit": [
      {
        "name": "El Boquerón National Park",
        "description": "A stunning volcanic crater with hiking trails and panoramic views of San Salvador.",
        "location": "San Salvador",
        "coordinates": "13.7231° N, 89.2906° W",
        "images": [
          "/images/el-boqueron-1.jpg",
          "/images/el-boqueron-2.jpg"
        ],
        "category": "Nature",
        "rating": "4.8",
        "distance": "15 km from city center"
      }
    ],
    
    // Activities by Category
    "activities": {
      "adventure": [
        {
          "name": "Hiking El Boquerón",
          "description": "Explore the volcanic crater with guided hiking tours.",
          "difficulty": "Medium",
          "duration": "2-3 hours",
          "category": "Hiking",
          "bestTime": "Early morning (6-9 AM)",
          "location": "El Boquerón National Park",
          "coordinates": "13.7231° N, 89.2906° W"
        }
      ],
      "culture": [
        {
          "name": "Museo Nacional de Antropología",
          "description": "Learn about El Salvador's rich history and culture.",
          "difficulty": "Easy",
          "duration": "1-2 hours",
          "category": "Museum",
          "bestTime": "Tuesday-Sunday, 9 AM-5 PM",
          "location": "San Salvador"
        }
      ],
      "food": [
        {
          "name": "Pupusa Tasting Tour",
          "description": "Experience authentic Salvadoran cuisine with a guided food tour.",
          "difficulty": "Easy",
          "duration": "3-4 hours",
          "category": "Food Tour",
          "bestTime": "Evening (5-9 PM)",
          "location": "Mercado Central"
        }
      ],
      "nature": [
        {
          "name": "Bird Watching",
          "description": "Observe diverse bird species in natural habitats.",
          "difficulty": "Easy",
          "duration": "2-3 hours",
          "category": "Wildlife",
          "bestTime": "Early morning (6-8 AM)",
          "location": "Various locations"
        }
      ],
      "beaches": [],
      "history": []
    }
  }
}
```

## Activity Difficulty Levels
- **Easy**: Suitable for all ages and fitness levels
- **Medium**: Moderate physical activity required
- **Hard**: Strenuous activity, good physical condition recommended

## Activity Duration Format
- Use descriptive formats like: "1-2 hours", "Half day", "Full day", "2-3 hours"

## Image Paths
- Use relative paths from the public folder: `/images/filename.jpg`
- Or use external URLs: `https://example.com/image.jpg`

