# Odoo Hackathon 2025 - Final Round Problem Statements

You can choose any one problem statement out of the given three!

All the best!

---

## Problem Statement 1: QuickCourt - A Local Sports Booking

### Overview

QuickCourt is a platform that enables sports enthusiasts to book local sports facilities (e.g., badminton courts, turf grounds, tennis tables) and create or join matches with others in their area. Your goal is to build a full-stack web application that facilitates this end-to-end experience, ensuring a smooth user experience, booking accuracy, and community engagement.

### Roles

- User
- Facility Owner
- Admin

### User Role

#### Features & Functionalities

- **Authentication**
  - Login with email and password
  - Sign up with email, password, full name, avatar, and role
  - OTP verification step after signup
- **Home Page**
  - Welcome banner or carousel
  - Quick access to: Popular venues, Popular sports
- **Venues Page**
  - List of all approved sports venues
  - Search for a venue
  - Filters: sport type, price, venue type, rating
  - Pagination
  - Each card displays: Venue Name, Sport Type(s), Starting Price per hour, Short Location, Rating (if reviews implemented)
- **Single Venue Page**
  - Full details of the selected venue: Name, description, address, List of Sports available, Amenities, About Venue, Photo gallery, Reviews section
  - Action: Book Now button
- **Court Booking Page**
  - Select court and time slot
  - View price and total
  - Proceed to confirm and simulate payment
  - After success, redirect to "My Bookings"
- **Profile Page**
  - Display user details: Name, Email
  - Allow edit/update info
  - Tabs: My Bookings
- **My Bookings Page**
  - List of all court bookings
  - Each booking card shows: Venue name, sport type, court name, Date and time of booking, Status: Confirmed / Cancelled / Completed, Action: Cancel button (if in the future)
  - Optional: Filters by date or status

### Facility Owner Role

#### Features & Functionalities

- **Dashboard**
  - Welcome message and KPIs: Total Bookings, Active Courts, Earnings (simulated), Booking Calendar
  - Charts: Daily/Weekly/Monthly Booking Trends (Line/Bar Chart), Earnings Summary (Bar or Doughnut Chart), Peak Booking Hours (Heatmap or Area Chart)
- **Facility Management Page**
  - Add/Edit facility details: Name, location, description, Type of sports supported, Amenities offered, Upload multiple photos
- **Court Management Page**
  - Court name, sport type, Pricing per hour, Operating hours
  - Edit/delete existing courts
- **Time Slot Management**
  - Set availability for each court
  - Block time slots for maintenance
- **Booking Overview Page**
  - View upcoming and past bookings
  - Each record shows: User name, court, time, Status: Booked / Cancelled / Completed
- **Profile Page**
  - Display owner details
  - Allow edit/update info

### Admin Role

#### Features & Functionalities

- **Dashboard**
  - Global stats overview: Total users, Total facility owners, Total bookings, Total active courts
  - Charts: Booking Activity Over Time (Line or Bar Chart), User Registration Trends, Facility Approval Trend, Most Active Sports, Earnings Simulation Chart
- **Facility Approval Page**
  - View list of pending facility registrations
  - Approve or reject with optional comments
  - See submitted facility details and photos
- **User Management Page**
  - List of all users and facility owners
  - Search and filter by role or status
  - Actions: Ban/unban user, View user booking history
- **Reports & Moderation Page (Optional)**
  - View reports submitted by users
  - Take action on flagged facilities or users
- **Profile Page**
  - Display admin profile
  - Allow basic info update

**Mockups:** [QuickCourt Mockups](https://link.excalidraw.com/l/65VNwvy7c4X/AU4FuaybEgm)

---

## Problem Statement 2: GlobeTrotter – Empowering Personalized Travel Planning

### Overall Vision

GlobeTrotter aims to become a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. The platform empowers users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool that combines flexibility and interactivity.

### Mission

Build a user-centric, responsive application that simplifies the complexity of planning multi-city travel. The platform should provide travelers with intuitive tools to:

- Add and manage travel stops and durations
- Explore cities and activities of interest
- Estimate trip budgets automatically
- Visualize timelines and plans
- Share trip plans with others

### Problem Statement

Design and develop a complete travel planning application where users can:

- Create customized multi-city itineraries
- Assign travel dates, activities, and budgets
- Discover activities and destinations through search
- Receive cost breakdowns and visual calendars
- Share their plans publicly or with friends

The application must demonstrate proper use of relational databases to store and retrieve complex travel data such as user-specific itineraries, stops, activities, and estimated expenses. The system should also support dynamic user interfaces that adapt to each user's trip flow.

### Features

1. **Login / Signup Screen**: Authenticate users to manage personal travel plans.
2. **Dashboard / Home Screen**: Central hub showing upcoming trips, popular cities, and quick actions.
3. **Create Trip Screen**: Form to initiate a new trip by providing a name, travel dates, and a description.
4. **My Trips (Trip List) Screen**: List view of all trips created by the user with basic summary data.
5. **Itinerary Builder Screen**: Interface to add cities, dates, and activities for each stop.
6. **Itinerary View Screen**: Visual representation of the completed trip itinerary.
7. **City Search**: Search interface to find and add cities to a trip.
8. **Activity Search**: Browse and select things to do in each stop.
9. **Trip Budget & Cost Breakdown Screen**: Summarized financial view showing estimated total cost and breakdowns.
10. **Trip Calendar / Timeline Screen**: Calendar-based or vertical timeline view of the full itinerary.
11. **Shared/Public Itinerary View Screen**: Public page displaying a sharable version of an itinerary.
12. **User Profile / Settings Screen**: User settings page to update profile information and preferences.
13. **Admin / Analytics Dashboard (Optional)**: Admin-only interface to track user trends, trip data, and platform usage.

**Mockup:** [GlobeTrotter Mockups](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)

---

## Problem Statement 3: Rental Management

Rental application streamlines the entire rental process. It provides a unified platform to manage products, schedule pickups.

Online booking and reservations are done through a website portal. Customers can shop available products, reserve their selected dates, and checkout right on the website.

Whether you rent by the hour, week, month or year, create customized pricing for every product based on different time frames.

### Roles

- Customer
- End user

### Core Rental Features

1. **Rental Product Management**
   - Define Rentable Products: Mark products as rentable and configure units (e.g., per hour, day, week).
   - Custom Rental Duration: Supports short-term and long-term rentals with flexible durations.
   - Product Availability: View product availability in calendar or list view to avoid overbooking.
2. **Rental Quotations & Orders**
   - Create rental quotations, confirm them into rental orders, and generate rental contracts.
   - Customers can review, confirm, and pay online through the customer portal.
   - Pickup/Return Scheduling: Track and schedule pickup and return with precise timing.
   - Notifications: Automated reminders via email and/or portal alerts, sent N days before the scheduled rental return date. Customizable N value for notification lead time.
   - Payment Gateway Integration: At least one secure payment gateway must be configured (e.g., PayPal, Stripe, Razorpay).
3. **Delivery Management**
   - Reservation (Order Confirmed): System reserves the required items.
   - Pickup (Delivery to the Customer): System creates a pickup document for the team.
   - Return (Collecting Back from the Customer): System generates a return document for the team.
4. **Flexible Invoicing**
   - Full upfront payment, partial payment/deposit, late return fees.
5. **Pricelist Management**
   - Multiple pricelists for different customer segments, regions, or rental durations.
   - Time-dependent pricing, discount rules, product category or customer-specific rules, validity periods.
6. **Returns & Delays Handling**
   - Alerts for late returns, automatic late fees or penalties.
7. **Reports and Dashboards**
   - Downloadable reports (PDF, XLSX, CSV), tracking most rented products, total rental revenue, top customer.

**Mockup:** [Rental Management Mockups](https://link.excalidraw.com/l/65VNwvy7c4X/1C10DktExEQ)
