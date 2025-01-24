# Chat with XLSX & CSV Data: Interactive Data Insights

This project enables users to upload `.xlsx` and `.csv` files and interact with the uploaded data through a chat interface. Users can ask questions, get summaries, and derive insights from the data. It features file upload functionality, data rendering with pagination, and a conversational assistant.

---

## Features

1. **File Upload**: Upload `.xlsx` and `.csv` files with intuitive drag-and-drop or click-to-upload functionality.
2. **Data Display**: View uploaded data with pagination and tab-based navigation for multiple files.
3. **Chat Functionality**:
   - Conversational interface to query and analyze uploaded data.
   - AI-powered assistant for detailed responses.
   - Dynamic "thinking" or "typing" indicator while the assistant processes queries.
4. **Dark and Light Mode Compatibility**: Automatically adapts to the user's theme preferences.
5. **Pagination**: Navigate large datasets easily with next/previous buttons.
6. **File Management**: Delete specific files or clear all uploaded files at any time.

---

## Tech Stack

- **Frontend**:
  - **React**: Component-based architecture for seamless UI updates.
  - **Next.js**: File-based routing and server-side rendering.
  - **Tailwind CSS**: Responsive design and styling.
  - **React Dropzone**: Intuitive file upload handling.
  - **Framer Motion**: Smooth animations for user interactions.
  - **React Markdown**: Render chat responses with Markdown support.
- **Backend**:
  - **API Routes (Next.js)**: Handles AI processing and file parsing.
  - **AI Integration**: Uses AI APIs (e.g., OpenAI or Gemini) for natural language processing.

---

## Installation

### Prerequisites

- **Node.js**: >=16.x
- **npm** or **yarn** package manager

### Clone the Repository

```bash
git clone https://github.com/Pawardevelops/doc-ai.git
cd doc-ai
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# AI Model API Key (e.g., OpenAI or Gemini API)
GEMINI_API_KEY=your-api-key-here

# AI Model Endpoint (if needed)
NEXT_PUBLIC_AI_API_ENDPOINT=https://api.example.com
```

### Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:3000` in your browser to see the app.

---

## Folder Structure

```
├── public/                  # Static files (e.g., images, icons, and other static assets)
│   ├── images/              # Optional: Store images, videos, or other assets
│   └── favicon.ico          # Favicon for the app
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/      # Shared components (optional: header, footer, etc.)
│   │   ├── api/             # Backend API routes
│   │   │   ├── chat/        # API endpoint for chat
│   │   │   │   └── route.js # Logic for handling /api/chat requests
│   │   └── page.js          # Main page entry point (Home component)
│   ├── lib/                 # Optional: Helper libraries or utility functions
├── .env.local               # Environment variables (e.g., API keys, secret tokens)
├── package.json             # Project dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── README.md                # Project documentation
├── next.config.js           # Next.js configuration
├── jsconfig.json            # JavaScript configuration (e.g., path aliases)
└── yarn.lock / package-lock.json # Dependency lockfile

```

---

## Usage

### 1. Upload Files
- Drag and drop `.xlsx` or `.csv` files into the upload area or click to select files manually.
- View each file in a dedicated tab, with data rendered in a paginated table.

### 2. Ask Questions
- Type questions about the uploaded data into the chat input (e.g., "Summarize the data", "What is the total sales?").
- The AI will analyze the data and provide responses in natural language.

### 3. Manage Files
- Remove individual files using the "Remove" button.
- Upload additional files as needed.
- Deleted files will also remove their associated content from the tabs.

---

## Screenshots

### File Upload
![File Upload](/public/images/upload.png)

### Chat Interface
![Chat Interface](/public/images/chat.png)

### Data Pagination
![Data Pagination](/public/images/content.png)

### Page
![Page](/public/images/page.png)
---

## Customization

### Modify AI Query Behavior
Edit the `/api/chat.js` file to customize how the AI processes user queries and interacts with uploaded data.

### Styling
All styles are built with **Tailwind CSS**. To modify colors, fonts, or layouts, update the `tailwind.config.js` or override styles in the `src/styles` folder.

---

## Deployment

1. **Build the Project**:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the Production Server**:

   ```bash
   npm start
   # or
   yarn start
   ```

3. **Deploy on Vercel** (recommended):
   - Commit and push your project to GitHub.
   - Connect your repository to [Vercel](https://vercel.com/) for seamless deployment.

---

## Future Enhancements

1. **Support for More File Formats**: Add support for `.pdf`, `.docx`, and other formats.
2. **Advanced Analysis**: Enable graph-based visualizations and deeper insights.
3. **User Authentication**: Allow users to save their files and queries.
4. **Multi-language Support**: Localize the interface and AI responses.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add new feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## Contact

- **Author**: Sachin Pawar
- **Email**: pawardevelops@gmail.com
- **GitHub**: [Your GitHub Profile](https://github.com/Pawardevelops)

---

Happy coding! 🚀