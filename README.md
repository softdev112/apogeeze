# Apogeeze Project

## Description
This project is a web application that combines a frontend built with React and a backend using Node.js and Express. It utilizes Axios for making API calls.

## Prerequisites
- Node.js installed
- Docker installed

## Getting Started
1. **Clone the Repository:**
  ```bash
    git clone https://github.com/softdev112/apogeeze.git
    cd apogeeze
  ```

2. **Start The Backend:**
  ```bash
    cd backend/
    docker build -t backend .
    docker run -p 5000:5000 backend
  ```

3. **Start the Frontend:**
  ```bash
    cd ../frontend/
    docker build -t frontend .
    docker run -p 3000:3000 frontend
  ```
4. **Access the App:**
  - Open a web browser.
  - Go to http://localhost:3000 to access the running application.


## Project Structure
  - /backend: Contains the Node.js backend files.
  - /frontend: Includes the React frontend files.

## Additional Notes
  - The backend runs on port 5000: http://localhost:5000
  - The frontend is accessible at http://localhost:3000
  - Adjust configurations or environment variables as needed.

## Contributing

Feel free to contribute by opening issues or pull requests.

## License

This project is licensed under the [MIT] - see the LICENSE file for details.



