**Technology Stack**
**1. Frontend (User Interface Layer)**

The frontend of the Brain Age Estimation Web Application is responsible for user interaction, MRI image upload, inference visualization, and displaying prediction history.
It is designed for **responsiveness, performance, and interactivity** using the following technologies:

* **React.js (TypeScript):**
  Provides a modular, component-based architecture for building a dynamic web interface and managing state efficiently during the model inference process.

* **Tailwind CSS:**
  A utility-first CSS framework used to create a clean, modern, and responsive UI design. It supports gradient backgrounds, responsive layouts, and smooth animations.

* **Framer Motion:**
  Used to create visual transitions, animations, and progress indicators during model loading and prediction, enhancing user engagement.

* **Lucide-React Icons:**
  Provides scalable vector icons for status indication (e.g., upload complete, error, or inference progress).

* **Axios / Fetch API:**
  Enables communication between the frontend and backend through RESTful API calls, allowing MRI scans to be uploaded and results to be retrieved seamlessly.

---

### **2. Backend (Inference and API Layer)**

The backend handles MRI image preprocessing, model inference, and result computation. It ensures **efficient, asynchronous communication** with the frontend.

* **FastAPI (Python):**
  A high-performance web framework used to build RESTful APIs for image upload, model inference, and response generation. It supports asynchronous operations, ensuring faster response times during inference.

* **PyTorch:**
  Deep learning framework used to load and execute the pre-trained **ResNet-50** model. It performs feature extraction and regression to estimate the brain’s biological age from MRI data.

* **NumPy & OpenCV:**
  Used for image manipulation, normalization, and resizing operations to ensure consistency in MRI inputs of various file types (NIfTI, PNG, JPG, PDF).

* **Pydantic Models:**
  Employed within FastAPI for data validation and type checking during API communication.

**3. Deep Learning Model**

The core model is a **3D Convolutional Neural Network (3D-CNN)** built upon the **ResNet-50** architecture, fine-tuned for MRI-based regression tasks.

* **Model Type:** 3D CNN based on **ResNet-50**
* **Framework:** PyTorch
* **Input:** Preprocessed MRI scans (NIfTI / PNG / JPG / PDF)
* **Output:** Estimated Brain Age (continuous regression value)
* **Loss Function:** Mean Absolute Error (MAE)
* **Optimizer:** Adam optimizer
* **Evaluation Metrics:** MAE, R² score, and confidence score


download the dataset from https://drive.google.com/file/d/1M-isVkdWSuBEwhfp2Oto8-2UxGD4DLV-/view?usp=drive_link
