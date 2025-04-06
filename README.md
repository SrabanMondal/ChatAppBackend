Updated Implementation Plan for ChatNest
OTP Verification and Password Reset: Use Nodemailer.
Node-Cron: Clean up expired OTPs hourly; optionally send daily chat summaries.
Cloudinary: Store profile pictures and chat media.
PM2: Optimize with a single instance.
Bull:
Queue welcome emails (directly in API).
Queue chat message notifications for offline users.
Socket.IO: Implement secure chat.
MongoDB: Store chat messages.
Image Sending in Chat: Use Cloudinary.
Multer: File uploads for profile pictures.
Streaming Files: Stream log files for admins.
SSE: Live admin notifications.
Events and Listeners: User activity tracking (analytics, admin notifications).
