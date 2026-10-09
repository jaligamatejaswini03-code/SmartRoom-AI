# SmartRoom AI – A Generative AI-Based Personalized Interior Design and Room Visualization System

> **B.Tech Computer Science & Engineering (AI / Data Science) Capstone Project**  
> **Topic:** Generative AI for Automated Architectural Interior Planning, Value-Engineered Spatial Optimization, and Photorealistic Vision Synthesis Without Photo Uploads.

---

## 1. Project Overview & Objective

Traditional interior design platforms force users to upload existing room photographs or draw complicated CAD floorplans. **SmartRoom AI** introduces a zero-photo generative paradigm:
Users input high-level spatial requirements (room type, dimensions, style, color preferences, budget, furniture requirements, lighting mood, and lifestyle notes). The system utilizes Generative AI to automatically generate:

1. **A Personalized Interior Design Plan**: Architectural layout, zoning, clearance rules, and materials.
2. **Realistic AI-Generated Room Visualizations**: Photorealistic 16:9 interior renders generated directly from requirements without requiring any uploaded room photographs.
3. **Furniture, Lighting, and Decoration Recommendations**: Specific dimensioned items, unit prices, and placement coordinates.
4. **Value-Engineered Budget Breakdown**: Granular allocations for furniture, lighting, decor, storage, and contingency reserves.
5. **Multiple Design Concepts**: 3 distinct architectural options (e.g., *Modern Minimalist*, *Warm Contemporary*, *Luxury Modern*) synthesized simultaneously.
6. **Interactive AI Interior Design Assistant ("Ask SmartRoom AI")**: A context-aware chatbot grounded in the active design specifications.
7. **Automated Budget Optimization**: Automatic identification of cost drivers, suggesting modular materials and alternative fixtures.
8. **Persistent SQLite Design Database**: Full storage and retrieval for design requests, plans, and visual thumbnails.

---

## 2. System Architecture

```
User Input Requirements (Dimensions, Style, Budget, Furniture, Lighting)
                           │
                           ▼
          React SPA Frontend (TypeScript + Tailwind CSS)
                           │
            HTTP POST /generate-design (REST API)
                           │
       FastAPI Backend / Node Full-Stack Proxy (`server.ts`)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
 1. Generative AI Service             2. AI Vision Service
  - Space-planning prompt              - Specialized photorealistic prompt
  - Structured JSON schema             - High-resolution 16:9 visualization
  - Multi-concept generation           - Zero uploaded photo needed
        │                                     │
        └──────────────────┬──────────────────┘
                           ▼
       SQLite Database (`smartroom.db`)
         - users
         - design_requests
         - design_results
                           │
                           ▼
       Interactive Results Dashboard
         - Prominent Visual Canvas (Zoom, Overlays, Download)
         - 3 Multi-Style Concept Cards
         - Interactive Color Swatches & 60-30-10 Rule
         - Furniture & Clearance Plan
         - Lighting Kelvin Spectrum
         - Budget Breakdown & Value Optimizer
         - Context-Aware AI Chat Assistant
```

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend**: Python FastAPI (`backend/main.py`) + Full-Stack Express Server (`server.ts`).
- **Database**: SQLite 3 with persistent relational schema (`smartroom.db`).
- **AI Models**:
  - Planning & Synthesis: Google Gemini (`gemini-3.8-flash`) / Generative AI API.
  - Visualization: Gemini Image Generation (`gemini-3.1-flash-image`) + Matched Photorealistic Visual Renders.
- **Environment Management**: `python-dotenv` & `.env` configuration.

---

## 4. Project Directory Structure

```
smartroom-ai/
├── backend/
│   ├── main.py                  # FastAPI application entry point
│   ├── database/
│   │   ├── database.py          # SQLite connection and table initializers
│   │   └── models.py            # SQLite CRUD query functions
│   ├── models/
│   │   └── schemas.py           # Pydantic schemas for request & response validation
│   ├── routes/
│   │   ├── design_routes.py     # Endpoints for /generate-design, /modify-design, /optimize-budget
│   │   ├── chat_routes.py       # Endpoints for context-aware /chat
│   │   └── history_routes.py    # Endpoints for /designs (SQLite retrieval & deletion)
│   ├── services/
│   │   ├── ai_design_service.py # Generative AI prompt construction & JSON parser
│   │   ├── ai_image_service.py  # Image prompt construction & photorealistic generation
│   │   └── budget_service.py    # Value-engineering algorithms & material alternatives
│   └── requirements.txt         # Python dependencies
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Global header with navigation
│   │   ├── Footer.tsx           # Academic & architecture footer
│   │   ├── FeatureCards.tsx     # 6 interactive feature overview cards
│   │   ├── RequirementsForm.tsx # Comprehensive form ("Tell us about your dream room")
│   │   ├── VisualizationViewer.tsx # Prominent room render with zoom, overlays & download
│   │   ├── DesignConcepts.tsx   # 3 distinct concept cards with switcher
│   │   ├── DesignDetails.tsx    # Furniture, lighting, decor, materials & budget breakdown
│   │   ├── ModifyModal.tsx      # Quick chips + custom prompt modifier
│   │   ├── BudgetOptimizerModal.tsx # Value-engineering modal
│   │   └── ChatAssistantDrawer.tsx  # "Ask SmartRoom AI" conversational drawer
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── RequirementsPage.tsx # Requirements input & step-by-step progress loader
│   │   ├── ResultsPage.tsx      # Complete results dashboard
│   │   ├── HistoryPage.tsx      # "My Designs" database catalog
│   │   └── ChatPage.tsx         # Standalone chat assistant page
│   ├── services/
│   │   └── api.ts               # REST client connecting to backend
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main router and state manager
│   ├── index.css                # Tailwind CSS & typography rules
│   └── main.tsx                 # React entry point
├── db_manager.py                # Standalone SQLite CLI bridge
├── server.ts                    # Full-Stack dev server integrating Vite & Express
├── smartroom.db                 # SQLite database file
├── .env.example                 # Configurable API keys & DB path
├── package.json
└── README.md
```

---

## 5. Database Schema (SQLite)

The application uses SQLite (`smartroom.db`) with three tables:

```sql
-- 1. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Design Requests Table
CREATE TABLE design_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    room_type TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    style TEXT NOT NULL,
    colors TEXT NOT NULL,
    budget TEXT NOT NULL,
    furniture TEXT NOT NULL,
    lighting TEXT NOT NULL,
    decorations TEXT NOT NULL,
    additional_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 3. Design Results Table
CREATE TABLE design_results (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    design_summary TEXT NOT NULL,
    recommendations TEXT NOT NULL,    -- JSON containing colors, furniture, lighting, decor
    budget_breakdown TEXT NOT NULL,   -- JSON containing categorized expenditure
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(request_id) REFERENCES design_requests(id)
);
```

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)

### Option A: Run Full-Stack with Vite + Node/Express (Integrated Applet)

1. Clone or download the repository:
   ```bash
   cd smartroom-ai
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY if available
   ```

4. Start the application:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

### Option B: Run Python FastAPI Backend + React Frontend Separately

#### 1. Setup Python FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
python main.py
```
*FastAPI server will be running on `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.*

#### 2. Setup React Frontend
```bash
# In the root project directory:
npm install
npm run dev
```

---

## 7. Example API Request & Response

### Request: `POST /generate-design`

```json
{
  "room_type": "Living Room",
  "length": "16",
  "width": "14",
  "height": "10 ft",
  "style": "Modern",
  "colors": ["Warm Beige", "Charcoal Slate", "Brushed Brass"],
  "budget": "₹1,00,000–₹2,00,000",
  "furniture": ["Sofa", "Coffee Table", "TV Unit", "Storage"],
  "lighting": "Warm",
  "decorations": ["Indoor plants", "Wall art", "Curtains", "Rugs"],
  "additional_requirements": "I want maximum storage and enough space for studying."
}
```

### Response: `200 OK`

```json
{
  "id": "res_84d7a8e2-192b-42e1-8524",
  "request_id": "req_f18e9a2b-23c4-42b8",
  "room_type": "Living Room",
  "dimensions": "16 ft × 14 ft × 10 ft",
  "style": "Modern",
  "budget": "₹1,00,000–₹2,00,000",
  "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  "design_summary": "A refined modern spatial plan engineered for your 16' × 14' (224 sq.ft) living room. Establishes seamless visual flow through warm beige tonal planes, an uninterrupted 38-inch entrance axis, and hidden perimeter joinery.",
  "color_palette": [
    {"name": "Warm Alabaster", "hex": "#F5F5F0", "role": "Primary Wall"},
    {"name": "Architectural Charcoal", "hex": "#2A2E2B", "role": "Secondary Contrast"},
    {"name": "Brushed Champagne Gold", "hex": "#C6A15B", "role": "Accent Metallic"},
    {"name": "Natural Sand", "hex": "#8E8578", "role": "Textile Base"}
  ],
  "furniture_recommendations": [
    {
      "name": "Modern Sofa",
      "purpose": "3-seater high-resilience foam lounge seating",
      "placement": "Positioned against north wall with 36\" walking clearance",
      "price": "₹38,000",
      "dimensions": "84\"W x 34\"D x 32\"H"
    },
    {
      "name": "Modern Coffee Table",
      "purpose": "Low-profile organic nesting table",
      "placement": "Centered on area rug, 18\" from sofa seat edge",
      "price": "₹12,000",
      "dimensions": "36\"W x 22\"D x 16\"H"
    }
  ],
  "lighting_recommendations": {
    "ambient": "Flush 3000K warm downlights spaced at 4-foot grid",
    "task": "Directional 450-lumen desk/reading luminaire",
    "accent": "2700K concealed LED cove ribbon beneath credenza",
    "color_temperature": "2700K - 3000K Warm Architectural White"
  },
  "budget_breakdown": {
    "furniture": "₹75,400",
    "lighting": "₹20,300",
    "decorations": "₹14,500",
    "storage": "₹23,200",
    "other": "₹11,600",
    "total": "₹1,45,000"
  },
  "concepts": [
    {
      "id": "concept-1",
      "name": "Modern Balanced",
      "style": "Modern",
      "description": "Balanced storage efficiency with warm minimalism.",
      "estimated_budget": "₹1,45,000",
      "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "highlight": "Maximum ergonomic utility"
    },
    {
      "id": "concept-2",
      "name": "Warm Contemporary",
      "style": "Contemporary",
      "description": "Organic curved forms, tactile bouclé, and earthy ceramics.",
      "estimated_budget": "₹1,52,000",
      "image_url": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf",
      "highlight": "Acoustic comfort and soft lounge warmth"
    },
    {
      "id": "concept-3",
      "name": "Luxury Modern",
      "style": "Luxury",
      "description": "Fluted wall panels, deep charcoal accents, and champagne metals.",
      "estimated_budget": "₹1,80,000",
      "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "highlight": "Bespoke joinery and mood cove lights"
    }
  ]
}
```

---

## 8. AI Prompt Construction Strategy

### A. Interior Architecture Planning Prompt
Constructed dynamically with real architectural constraints:
```
You are an expert interior designer and space-planning consultant.
Create a personalized interior design for the following room.

Room Type: {room_type}
Room Dimensions: {length} ft × {width} ft
Room Height: {height}
Interior Style: {style}
Preferred Colors: {colors}
Budget: {budget}
Furniture Requirements: {furniture}
Lighting Preference: {lighting}
Decoration Preferences: {decorations}
Additional Requirements: {additional_requirements}

Design the room while respecting the given dimensions, style, colors, furniture requirements and budget.
Provide:
1. Design Summary
2. Color Palette
3. Furniture Recommendations
4. Furniture Placement
5. Lighting Recommendations
6. Decoration Ideas
7. Space Utilization
8. Estimated Budget Breakdown
9. Materials Suggestions
10. Design Tips
...
```

### B. AI Room Image Generation Prompt
Constructed to enforce zero-human, zero-text, photorealistic rendering:
```
Generate a realistic interior-design visualization of a {room_type} measuring approximately {length} × {width} feet.

Style: {style}
Color palette: {colors}
Budget level: {budget}
Required furniture: {furniture}
Lighting: {lighting}
Decorations: {decorations}
Special requirements: {additional_requirements}

Create a realistic, professionally designed interior.
The room should:
- Respect the requested room dimensions
- Include the requested furniture
- Follow the requested interior style
- Use the requested colors
- Use appropriate furniture proportions
- Have realistic lighting
- Provide practical walking space
- Look aesthetically pleasing
- Follow the user's budget level

Generate a high-quality photorealistic interior-design visualization.
Do not show people.
Do not show text inside the image.
Do not add unrelated furniture or objects.
```

---

## 9. Error Handling & Security

- **Strict Validation**: Dimensions are checked for positive numeric values; missing styles or room types trigger helpful user feedback.
- **API Failures**: If an external AI provider fails or rate-limits, the system falls back to an intelligent spatial rule engine so users always receive structured architectural outputs.
- **Key Safety**: API keys are stored strictly server-side in `.env` and are never bundled into client JavaScript.
- **Database Safety**: Parameterized queries in SQLite prevent SQL injection attacks.
