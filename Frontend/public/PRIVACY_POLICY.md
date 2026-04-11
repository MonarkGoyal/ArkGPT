# Privacy Policy

**Last Updated:** April 12, 2026

## 1. Introduction

ArkGPT ("we," "our," or "the Service") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.

## 2. Information We Collect

### 2.1 Chat Messages & Conversation History
- **What:** Your chat messages, conversation threads, and response mode preferences
- **How:** Submitted when you use the chat interface
- **Stored As:** In-memory (short-term) or MongoDB database (if available)
- **Retention:** Until you manually delete the thread or conversation

### 2.2 Feedback Submissions
- **What:** Feedback text, optional name, thread ID, and page origin URL (not full page URL with query parameters)
- **How:** Submitted via the "Send feedback" dialog
- **Stored As:** In-memory or MongoDB database
- **Retention:** Retained for service improvement purposes; can be deleted upon request

### 2.3 Usage Data
- **What:** Browser type, operating system, page load times, clicked features
- **How:** Automatically collected via browser logs and optional monitoring
- **Stored As:** Server access logs
- **Retention:** 30 days

### 2.4 IP Address
- **What:** Your IP address (used for rate limiting and abuse prevention)
- **How:** Automatically captured from HTTP requests
- **Stored As:** Temporarily in rate-limit buckets; not permanently logged
- **Retention:** 1 minute per request window

## 3. How We Use Your Information

We use the collected information to:
- Provide and improve the Service
- Respond to your feedback and support requests
- Prevent abuse, spam, and unauthorized access
- Comply with legal obligations
- Analyze usage patterns to enhance user experience

We **do NOT**:
- Sell your data to third parties
- Share your data with advertisers
- Use your information for marketing without consent
- Share identifiable information with external services (except OpenAI API calls for chat responses)

## 4. Third-Party Services

### OpenAI API
- Chat messages are sent to OpenAI's servers to generate responses
- Your data is governed by [OpenAI's Privacy Policy](https://openai.com/privacy)
- Disable OpenAI integration by not setting `OPENAI_API_KEY` to use offline fallback

### OpenWeather API
- Weather queries are sent to OpenWeather if the feature is enabled
- Your data is governed by [OpenWeather's Privacy Policy](https://openweathermap.org/privacy)

### GitHub Pages & Render
- Frontend is hosted on GitHub Pages; subject to [GitHub's Privacy Policy](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)
- Backend is hosted on Render; subject to [Render's Privacy Policy](https://render.com/privacy)

## 5. Data Security

We implement industry-standard security measures:
- HTTPS encryption for all data in transit
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Rate limiting to prevent abuse
- Input validation and sanitization
- No personal information stored in URLs or cookies unless necessary

## 6. User Rights & Controls

### 6.1 Access Your Data
- All your chat history and threads are accessible within the app
- You can export or view conversation data anytime

### 6.2 Delete Your Data
- Delete individual threads using the delete button in the sidebar
- Clear all data by clearing browser localStorage (for offline fallback)
- Request permanent deletion by contacting the service administrator

### 6.3 Data Portability
- You can export your conversation history anytime
- Request data in machine-readable format by contacting support

## 7. Cookies & Local Storage

This service uses:
- **localStorage:** Stores your response mode preference and local chat history (in-browser only)
- **Cookies:** Not used for tracking; only essential cookies set by GitHub Pages if needed
- **Third-party tracking:** None

## 8. Children's Privacy

This Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will take steps to delete it immediately.

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting. Your continued use of the Service after changes indicates acceptance of the updated Privacy Policy.

## 10. Contact Us

For privacy questions, data deletion requests, or concerns:

**GitHub Repository Issues:**
- [https://github.com/MonarkGoyal/ArkGPT/issues](https://github.com/MonarkGoyal/ArkGPT/issues)

**Email:**
- Contact via the repository's official contact method

---

**Summary for Google Safe Browsing Review:**
- No phishing: All data collection is transparent and necessary for service operation
- No malware: Code is open-source and security-hardened
- No unwanted software: No downloads or injection attempts
- User consent: Users explicitly submit feedback and chat messages
