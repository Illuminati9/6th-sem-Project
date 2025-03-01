# Plagarism Checker for Classroom Assignments 

## Introduction
Welcome to our Simple Classroom & Plagiarism Checker project! This platform helps teachers and students manage classes, assignments, and check for plagiarism in an easy and efficient way. It is inspired by Google Classroom but has its own features, especially an integrated plagiarism checker that uses a machine learning model.


## Why We Built This
We wanted a user-friendly tool for teachers (admins) to:
1. Create and manage classes, subjects, and sections (sub-classes).
2. Assign homework or projects to students.
3. Check assignments for plagiarism, both within the class and across the internet.
4. View clear reports showing which students have similar or copied content.

# Technology Stack

- React
- Material UI
- Node.js
- Express.js
- MongoDB
- Mongoose

## Key Features

1. **Admin Panel (Teacher)**
   - **Create Classes**: Teachers can set up different classes for each subject or batch.
   - **Sub-Classes/Sections**: Under each class, teachers can create specific sections or groups of students.
   - **Assignments**: Teachers can upload or describe assignments, set deadlines, and choose when and how students should submit.
   - **Plagiarism Detection**:
     - Checks assignments across all classes and sections to see if any two students have high similarity.
     - Scans the internet to see if any student’s work is copied from online sources.
   - **Results Dashboard**: Displays which students have the highest similarity with each other or with online content. Teachers can decide which results to view or highlight.

2. **User Panel (Students)**
   - **View Classes & Assignments**: Students can see all the classes they are enrolled in and the assignments they need to submit.
   - **Upload Work**: Students submit their assignments or projects directly on the platform.
   - **View Feedback**: Students can see if their submission has any plagiarism issues (depending on what the teacher chooses to share).

3. **Machine Learning Model**
   - The system automatically compares new assignments against existing student submissions and internet sources.
   - The model generates a plagiarism score, showing how much of the content matches elsewhere.
  
## Usage Tips
- **Admin/Teacher Role**: Use this role to set up the entire structure: classes, subjects, sections, assignments, and check plagiarism reports.
- **Student Role**: Students can only see and submit assignments and view their feedback or plagiarism status (if made visible).
- **Plagiarism Reports**: Teachers can filter the reports by class, section, or specific assignment.\
