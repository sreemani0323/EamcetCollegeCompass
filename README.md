# EAMCET College Predictor

## Project Overview

The EAMCET College Predictor is a comprehensive web application designed to help engineering aspirants in Andhra Pradesh  predict their college and branch admissions based on their EAMCET rank. The application provides intelligent predictions, detailed analytics, and comparison tools to help students make informed decisions about their academic future.

The system uses historical cutoff data from previous years to calculate admission probabilities and offers features like:
- College predictions based on rank and preferences
- Analytics dashboard with regional and branch-wise statistics
- Interactive map view of colleges
- Reverse calculator to determine required rank for desired colleges
- Branch comparison tools
- College recommendation engine

## Key Features

### Core Functionality
- **Rank-based Predictions**: Enter your EAMCET rank to get a list of colleges you're likely to get admitted to
- **Multi-filter Search**: Filter colleges by branch, region, district, tier, and placement quality
- **Admission Probability**: Calculates the likelihood of admission based on historical cutoff trends
- **Category & Gender Support**: Supports all reservation categories (OC, SC, ST, BC-A to BC-E, OC-EWS) for both boys and girls

### Analytics & Insights
- **Comprehensive Dashboard**: Visualize college distribution by region, tier, and branch
- **Branch Statistics**: Detailed statistics for each engineering branch including average packages
- **Placement Rankings**: Colleges ranked by placement quality and average packages
- **Cutoff Distribution**: View cutoff trends across different categories for specific colleges

### Advanced Tools
- **Reverse Calculator**: Determine what rank you need to achieve a desired probability of admission
- **College Comparison**: Compare multiple colleges side-by-side based on various parameters
- **Similar Colleges**: Find colleges similar to your target institution
- **Recommendation Engine**: Get personalized college recommendations based on your preferences

### User Experience
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Export Functionality**: Download results as PDF or CSV for offline reference

## Tech Stack

### Backend
- **Java 21**: Primary programming language
- **Spring Boot 3.5.5**: Framework for building the RESTful API
- **Maven**: Build automation and dependency management
- **MySQL**: Database for storing college information and cutoff data
- **JPA/Hibernate**: Object-relational mapping for database operations
- **Lombok**: Reducing boilerplate code in Java entities

### Frontend
- **HTML5/CSS3**: Structure and styling of web pages
- **JavaScript (ES6+)**: Client-side logic and interactivity
- **Font Awesome**: Icon library for UI elements
- **jsPDF**: PDF generation for result exports
- **Google Fonts**: Typography enhancements

### DevOps & Deployment
- **Docker**: Containerization for consistent deployment
- **Render**: Cloud platform for hosting the application
- **Aiven**: Managed MySQL database service
- **GitHub Pages**: Hosting for frontend static assets

## Installation Instructions

### Prerequisites
- Java 21 JDK
- Maven 3.9+
- MySQL 8.0+
- Docker (optional, for containerized deployment)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sreemani0323/EamcetCollegeCompass.git
   cd CollegePredictor420/BackEnd_Predictor/predictor
   ```

2. **Configure database**:
   - Create a MySQL database
   - Update the database credentials in `src/main/resources/application.properties`
   - Set the `DB_PASSWORD` environment variable

3. **Build the application**:
   ```bash
   ./mvnw clean package
   ```

4. **Run the application**:
   ```bash
   java -jar target/*.jar
   ```

### Frontend Setup

The frontend is a static website that can be served by any web server:
1. Navigate to the `docs` directory
2. Serve the files using any HTTP server (Apache, Nginx, etc.)
3. For development, you can use a simple server:
   ```bash
   npx http-server docs/
   ```

### Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t college-predictor .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 -e DB_PASSWORD=your_password college-predictor
   ```

## Usage Instructions

### API Endpoints

The backend provides a RESTful API with the following key endpoints:

- `POST /api/predict-colleges` - Get college predictions based on rank and filters
- `GET /api/analytics/summary` - Get analytics summary data
- `GET /api/analytics/branches` - Get all available branches
- `POST /api/reverse-calculator` - Calculate required rank for desired probability
- `GET /api/rankings/by-placement` - Get colleges ranked by placement quality
- `POST /api/recommendations` - Get personalized college recommendations

### Web Interface

1. Open `index.html` in your browser
2. Enter your EAMCET rank in the input field
3. Select your category, branch preferences, and other filters
4. Click "Predict Now" to see results
5. Use the advanced filters to refine your search
6. Sort results by cutoff, probability, or package
7. Export results as PDF or CSV

## Folder Structure

```
CollegePredictor420/
├── BackEnd_Predictor/
│   └── predictor/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/Eamcet/predictor/
│       │   │   │   ├── controller/     # REST API controllers
│       │   │   │   ├── dto/            # Data Transfer Objects
│       │   │   │   ├── exception/      # Custom exceptions
│       │   │   │   ├── model/          # JPA entities
│       │   │   │   ├── repository/     # Data access interfaces
│       │   │   │   └── service/        # Business logic
│       │   │   └── PredictorApplication.java  # Main application class
│       │   │   └── resources/
│       │   │       ├── application.properties     # Configuration
│       │   │       └── application-prod.properties # Production config
│       │   └── test/                   # Unit and integration tests
│       ├── Dockerfile                  # Docker configuration
│       ├── pom.xml                     # Maven configuration
│       └── render.yaml                 # Render deployment config
├── docs/                               # Frontend static files
│   ├── index.html                      # Main prediction interface
│   ├── analytics.html                  # Analytics dashboard
│   ├── map.html                        # Interactive map view
│   ├── calculator.html                 # Reverse calculator
│   ├── branch-comparison.html          # Branch comparison tool
│   ├── *.js                            # JavaScript files
│   └── style.css                       # Main stylesheet
├── DOCUMENTATION_SUMMARY.md            # Project documentation summary
└── test-endpoints.html                 # API testing interface
```

## Configuration

### Environment Variables

- `DB_PASSWORD` - MySQL database password (required)
- `PORT` - Server port (defaults to 8080)
- `JAVA_OPTS` - JVM options for memory management

### Application Properties

Key configuration options in `application.properties`:
- Database connection settings
- Connection pool configuration
- CORS settings for cross-origin requests
- Logging configuration
- Actuator endpoints for health checks

## Screenshots

![Main Prediction Interface](docs/study.jpeg)
*Main interface where users enter their rank and preferences*

The application features a modern, responsive design with:
- Clean, intuitive user interface
- Dark/light mode toggle
- Interactive filtering system
- Comprehensive result display with sorting options
- Export functionality

## Contributing

We welcome contributions to improve the EAMCET College Predictor! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write clear, concise commit messages
- Ensure all tests pass before submitting a PR
- Add documentation for new features
- Test changes thoroughly across different browsers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits & Acknowledgements

- **Nallimilli Mani** - Lead Developer and Creator
- **EAMCET Authorities** - For providing the cutoff data that powers this application
- **Open Source Community** - For the libraries and tools that made this project possible

### Special Thanks

- Spring Boot team for the excellent framework
- All contributors who have helped improve this tool
- The student community for their feedback and suggestions

---

*This application is designed to assist students in making informed decisions about their college admissions. Predictions are based on historical data and trends, and actual cutoffs may vary.*