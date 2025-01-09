# Event Scheduler (Refactored Version)

This is a refactored and improved version of a project previously available on my GitHub. It incorporates lessons learned and advancements in design and implementation to deliver a more robust, maintainable, and user-friendly solution.

---

## **About the Project**

The **Event Scheduler** is a comprehensive solution for managing events, featuring:
- User registration and authentication.
- Event creation, editing, and deletion.
- Validation to prevent scheduling conflicts.
- Multi-user support with events linked to their creators.
- RSVP functionality for inviting participants and managing responses.
- A fully responsive and modern user interface.

The frontend is built with a nearly total componentization approach, enabling clean, reusable, and scalable code.

---

## **Technologies Used**

### **Frontend**
- **React** with **TypeScript**: Dynamic, scalable, and maintainable user interface.
- **Bootstrap CSS**: Quickly build consistent and responsive designs.
- **React-Query**: Optimized state management for API interactions.
- **React Toastify**: Elegant and interactive user notifications.
- **React-Router**: Smooth navigation and routing.

### **Backend**
- **NestJS** with **TypeScript**: Modular and scalable backend architecture.
- **PostgreSQL**: Robust relational database.
- **TypeORM**: Simplified database operations through ORM.
- **JWT (JSON Web Tokens)**: Secure authentication for protected routes.
- **Class-Validator**: Rigorous validation for user inputs.

---

## **Key Features**

### **User Management**
- Secure registration with advanced field validations.
- JWT-based login and session management.
- Role-based access control for sensitive routes.

### **Event Management**
- Dynamic forms for creating, editing, and deleting events.
- Validation to prevent overlapping schedules.
- Support for multi-day events.
- Send invites to users with RSVP functionality.

### **User Experience**
- A nearly fully componentized frontend for clean, reusable, and maintainable code.
- Fully responsive and optimized for different screen sizes.
- Calendar integration highlighting events and RSVP statuses.

---

## **Why This Project Stands Out**
- Extensive componentization in React ensures scalability and easier maintenance.
- Modular backend built with NestJS for optimal performance and organization.
- Focus on user-centric design with a seamless, intuitive experience.

---

## **Future Enhancements**
- Real-time notifications for RSVP responses and event updates.
- Advanced search and filtering for events.
- Automated testing to ensure long-term maintainability.
