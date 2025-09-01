# CMS Troubleshooting Guide

## Issue: 404/500 Errors when accessing /cms

### Root Cause
The Payload CMS is not working because MongoDB is not installed or configured properly.

### Solution Steps

#### 1. Install MongoDB

**Option A: Install MongoDB Locally**
```bash
# On macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Option B: Use MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

#### 2. Update Environment Variables

Edit `.env.local`:
```env
PAYLOAD_SECRET=your-super-secret-key-here
MONGODB_URI=mongodb://127.0.0.1:27017/shikshanam-cms
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shikshanam-cms
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

#### 3. Initialize Admin User

```bash
npm run cms:init
```

#### 4. Restart Development Server

```bash
npm run dev
```

#### 5. Access CMS

Navigate to: `http://localhost:3000/cms`

### Alternative: Quick Setup with MongoDB Atlas

1. **Sign up for MongoDB Atlas** (free tier)
2. **Create a cluster**
3. **Get connection string** from Atlas dashboard
4. **Update .env.local** with the connection string
5. **Run setup script**:
   ```bash
   ./scripts/setup-cms.sh
   ```

### Testing the Setup

1. **Check MongoDB connection**:
   ```bash
   # If using local MongoDB
   mongo --eval "db.runCommand('ping')"
   ```

2. **Test CMS endpoint**:
   ```bash
   curl -I http://localhost:3000/cms
   ```

3. **Check admin interface**:
   ```bash
   curl -I http://localhost:3000/api/payload/admin
   ```

### Common Issues

#### Issue: "MongoDB connection failed"
- **Solution**: Ensure MongoDB is running
- **Local**: `brew services start mongodb-community`
- **Atlas**: Check connection string and network access

#### Issue: "PAYLOAD_SECRET not set"
- **Solution**: Set a secure secret in `.env.local`
- **Example**: `PAYLOAD_SECRET=my-super-secret-key-123`

#### Issue: "Admin user not found"
- **Solution**: Run the initialization script
- **Command**: `npm run cms:init`

### Quick Fix Commands

```bash
# 1. Install MongoDB (macOS)
brew tap mongodb/brew && brew install mongodb-community

# 2. Start MongoDB
brew services start mongodb-community

# 3. Update environment
echo "PAYLOAD_SECRET=shikshanam-cms-secret-2024" >> .env.local
echo "MONGODB_URI=mongodb://127.0.0.1:27017/shikshanam-cms" >> .env.local

# 4. Initialize admin
npm run cms:init

# 5. Start server
npm run dev
```

### Verification

After setup, you should be able to:
1. Access `http://localhost:3000/cms` (redirects to admin)
2. Login with `admin@shikshanam.com` / `adminadmin`
3. See the Payload admin interface
4. Create and manage content

### Next Steps

Once the CMS is working:
1. Create your first page
2. Add media files
3. Set up courses and content
4. Customize the admin interface
5. Configure live preview

---

**Need help?** Check the main `CMS_README.md` for detailed documentation.
