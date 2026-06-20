# DeepShield - Deepfake Video Detector

DeepShield is a full-stack web application designed to detect deepfake videos. With the rise of AI-generated media, DeepShield provides a reliable way to verify the authenticity of video content by allowing users to upload videos and analyze them for manipulation.

## Features

- **Video Upload:** Easy-to-use drag-and-drop interface for uploading videos.
- **Deepfake Detection:** Backend processing that analyzes video frames to determine if the content has been AI-generated or altered.
- **Results Dashboard:** Clear and intuitive results screen showing the confidence score and verdict (Real vs. Fake).
- **History Tracking:** View previously analyzed videos and their results.

## Tech Stack

### Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Custom CSS with modern UI/UX principles

### Backend
- **Framework:** Python (FastAPI / Flask)
- **Features:** Video processing and deepfake detection modeling

## Getting Started

### Prerequisites
- Node.js (for the frontend)
- Python 3.8+ (for the backend)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/vxchnu-13/deepshield.git
cd deepshield
```

**2. Setup Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**3. Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the [MIT License](LICENSE).
