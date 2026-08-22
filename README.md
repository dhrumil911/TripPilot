# ✈️ TripPilot

> **Plan the journey. Not just the destination.**

TripPilot is a modern travel planning web application that helps users create, organize, and manage multi-city trips with activities, expenses, timelines, and destination discovery in one place.

The application is designed to make trip planning simple, visual, and interactive while keeping the complete itinerary and budget organized.

---

## 🌍 Overview

TripPilot allows travelers to:

* Create and manage trips
* Add multiple cities/stops to a trip
* Organize destinations chronologically
* Explore Indian cities and destinations
* Discover activities based on the selected city
* Add activities to planned stops
* Manage travel dates
* Create a day-by-day timeline
* Track travel expenses
* View expense categories and summaries
* Calculate average spending per day
* View budget distribution visually
* Share trips
* Explore destinations
* Manage user settings
* Use the application on desktop and mobile devices

---

## ✨ Main Features

### 🗺️ Multi-City Trip Planning

Users can create a trip and add multiple destinations.

Each destination contains:

* City name
* Country
* Start date
* End date
* Destination image
* Activities
* Planned duration

The trip dynamically updates when users add, remove, or reorder cities.

---

### 📍 Destination Discovery

TripPilot provides a destination discovery experience for Indian cities.

Users can:

* Search destinations
* Browse cities
* Filter destinations
* Sort activities
* View destination images
* Start planning a trip from a destination

Example destinations include:

* Jaipur
* Udaipur
* Delhi
* Mumbai
* Goa
* Kochi
* Ahmedabad
* Bengaluru
* Hyderabad
* Kolkata
* Chennai
* Agra
* Varanasi
* Jodhpur
* Pune
* and other Indian destinations.

---

### 🎯 Dynamic Activity Selector

Activities are dynamically displayed according to the selected city.

For example:

**Jaipur**

* Amber Fort Tour
* Hawa Mahal
* City Palace
* Local heritage activities

**Udaipur**

* Lake Pichola Boat Ride
* City Palace Museum
* Lake and heritage activities

The activity selector supports:

* City-based activity filtering
* Activity search
* Category
* Duration
* Estimated cost
* Add activity functionality

When the user changes the selected stop, the activity catalog automatically changes according to that destination.

---

### 🗓️ Timeline Planner

TripPilot provides a visual timeline for planned activities.

Users can:

* Add activities to a date
* View activity duration
* Organize activities chronologically
* Move activities between dates
* View the trip timeline
* Switch between timeline and calendar views

---

### 📅 Calendar View

The calendar interface provides another way to visualize the itinerary.

Users can see:

* Trip dates
* Destinations
* Planned activities
* Activity timings
* Daily itinerary

---

### 💰 Expense Management

TripPilot includes an expense management system.

Users can add expenses and categorize them into:

* Stay & Lodging
* Meals & Dining
* Transport
* Activities
* Others

The application calculates:

* Total expenses
* Average expense per day
* Category totals
* Category percentages
* Budget distribution

---

### 📊 Expense Dashboard

The expense summary provides a visual representation of spending.

It includes:

* Total spent
* Average per day
* Category breakdown
* Progress indicators
* Visual distribution
* Budget concentration warnings

Example:

```text
Total Expenses
₹1,850

Average / Day
₹231

Transport
54%

Stay & Lodging
14%

Meals & Dining
32%
```

---

### 📒 Expense Ledger

The expense ledger allows users to view individual expenses.

Each expense contains information such as:

* Category
* Description
* Amount
* Delete option

---

### 🔗 Trip Sharing

TripPilot supports sharing trips with other users through shared trip functionality.

A shared trip can display:

* Destinations
* Dates
* Activities
* Itinerary information
* Trip details

---

### 👤 Authentication

TripPilot provides user authentication functionality including:

* Registration
* Login
* Logout
* Forgot password
* User-specific trips
* User settings

---

### ⚙️ Settings

Users can manage their application preferences and account-related settings through the Settings page.

---

## 📱 Responsive Design

TripPilot is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The UI includes responsive layouts for:

* Navigation
* Dashboard
* Trip planner
* Destination cards
* Activity selector
* Expense dashboard
* Timeline
* Calendar
* Forms

Mobile layouts are optimized to avoid:

* Horizontal overflow
* Cropped content
* Hidden buttons
* Incorrect spacing
* Small unreadable text
* Cut-off images

---

## 🎨 UI / Design

TripPilot uses a premium travel-journal inspired visual style.

### Design Characteristics

* Editorial typography
* Warm neutral background
* Dark green primary color
* Orange accent color
* Large destination imagery
* Clean cards
* Minimal borders
* Spacious layouts
* Responsive components

The overall design focuses on a premium travel-planning experience rather than a traditional dashboard.

---

## 🏗️ Project Structure

```text
TripPilot/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivitySelector.tsx
│   │   │   ├── BudgetBreakdown.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── DestinationCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── RouteVisualizer.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── CreateTrip.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── SharedTrip.tsx
│   │   │   ├── TripBudget.tsx
│   │   │   ├── TripCalendar.tsx
│   │   │   └── TripDetails.tsx
│   │   │
│   │   ├── data/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── tailwind.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── expense.controller.ts
│   │   │   ├── image.controller.ts
│   │   │   ├── search.controller.ts
│   │   │   ├── share.controller.ts
│   │   │   ├── trip.controller.ts
│   │   │   └── user.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── admin.middleware.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── image.routes.ts
│   │   │   ├── search.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── ...
│   │   │
│   │   └── db/
│   │       └── schema/
│   │
│   └── drizzle/
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Modern responsive CSS

### Backend

* Node.js
* TypeScript
* REST API
* Controllers
* Routes
* Middleware

### Database

* PostgreSQL
* Drizzle ORM
* Drizzle migrations

### External Services

* Unsplash images for destination imagery
* Image/search functionality

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd TripPilot
```

---

### 2. Install Client Dependencies

```bash
cd client
npm install
```

---

### 3. Install Server Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

### 4. Configure Environment Variables

Create the required environment files according to the project configuration.

Example:

```env
DATABASE_URL=your_database_url
```

Add any required API keys used by the backend.

> Do not commit `.env` files or secret API keys to GitHub.

---

### 5. Run the Frontend

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

### 6. Run the Backend

In another terminal:

```bash
cd server
npm run dev
```

---

## 🗄️ Database

TripPilot uses PostgreSQL with Drizzle ORM.

After configuring the database connection, run the project's migration commands.

Example:

```bash
npx drizzle-kit migrate
```

Use the migration commands defined in the project's server configuration if they differ.

---

## 🔐 Environment Variables

Do not expose sensitive credentials in the repository.

Typical configuration may include:

```env
DATABASE_URL=
JWT_SECRET=
UNSPLASH_ACCESS_KEY=
```

Use the actual variable names defined in the project.

---

## 🧪 Development Workflow

Recommended workflow:

```bash
# Check current changes
git status

# Create a feature branch
git checkout -b feature-name

# Add changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature-name
```

---

## 📦 Production Build

Build the frontend using:

```bash
cd client
npm run build
```

The production build will be generated in the configured Vite output directory.

Build and start the backend using the commands defined in the server package configuration.

---

## 🌐 Deployment

TripPilot can be deployed using separate frontend and backend services.

### Frontend

Recommended platforms:

* Vercel
* Netlify
* Cloudflare Pages

### Backend

Recommended platforms:

* Render
* Railway
* Fly.io

### Database

Recommended PostgreSQL providers:

* Neon
* Supabase
* Railway PostgreSQL

When deploying:

1. Deploy the database.
2. Configure backend environment variables.
3. Deploy the backend API.
4. Update the frontend API URL.
5. Deploy the frontend.
6. Test authentication.
7. Test trip creation.
8. Test activities.
9. Test expenses.
10. Test shared trips.

---

## 🔄 Application Flow

```text
User
 │
 ▼
TripPilot Frontend
 │
 ├── Authentication
 │
 ├── Explore Cities
 │
 ├── Create Trip
 │
 ├── Add Destinations
 │
 ├── Add Activities
 │
 ├── Manage Timeline
 │
 ├── Manage Calendar
 │
 └── Track Expenses
 │
 ▼
Backend API
 │
 ├── Auth
 ├── Users
 ├── Trips
 ├── Activities/Search
 ├── Expenses
 ├── Images
 └── Sharing
 │
 ▼
PostgreSQL Database
```

---

## 🎯 Core User Journey

```text
Register / Login
       ↓
Explore Indian Cities
       ↓
Select Destination
       ↓
Create Trip
       ↓
Add Multiple Stops
       ↓
Select Activities
       ↓
Build Timeline
       ↓
Add Expenses
       ↓
Review Budget
       ↓
Share Trip
```

---

## 📌 Important UI Components

### ActivitySelector

Displays activities dynamically based on the currently selected destination.

### DestinationCard

Displays:

* Destination image
* City
* Country
* Dates
* Destination number

### RouteVisualizer

Displays the itinerary route and destination sequence.

### CalendarView

Displays the trip itinerary in calendar format.

### BudgetBreakdown

Displays expense totals and category distributions.

### Navbar

Provides navigation between major application sections.

---

## 🔮 Future Improvements

Possible future enhancements include:

* Google Maps integration
* Real-time route distances
* Hotel recommendations
* Flight search
* Weather information
* AI-generated itineraries
* Smart budget recommendations
* Travel-time optimization
* Public trip marketplace
* Collaborative trip planning
* Notifications
* Offline trip access
* Progressive Web App support

---

## 🛡️ Security Considerations

* Keep API keys in environment variables.
* Never commit `.env` files.
* Validate API requests on the server.
* Protect authenticated routes.
* Validate user ownership before modifying trips.
* Sanitize user-provided data.
* Use secure password hashing.
* Use HTTPS in production.

---

## 👨‍💻 Development

TripPilot is developed as a full-stack travel planning application with a React-based frontend and Node.js backend.

The project focuses on combining:

**Travel Discovery + Itinerary Planning + Activity Management + Expense Tracking**

into one unified experience.

---

## 📄 License

This project is currently intended for educational, academic, and project-development purposes.

Add an appropriate open-source license here if the project is later released publicly.

---

## ⭐ TripPilot

**Plan the journey. Not just the destination.**

A smarter way to discover places, organize trips, manage activities, and control travel expenses.
